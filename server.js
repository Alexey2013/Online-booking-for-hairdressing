const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');

const app = express();
app.set('views', path.join(__dirname, 'public'));

app.use(express.urlencoded({ extended: false }));

const dbUrl = 'mongodb://localhost:27017/barbershop';

app.use(express.static(path.join(__dirname, 'public')));

// Главная страница
app.get("/", async function (request, response) {
    try {
        const database = await MongoClient.connect(dbUrl, { useUnifiedTopology: true });
        const db = database.db('barbershop');

        // Логирование для отладки
        console.log('Получаем список услуг и записей');
        const services = await db.collection('services').find().sort({ service_price: 1 }).toArray();
        const appointments = await db.collection('appointments').find().toArray();

        response.render('index.ejs', { services: services, appointments: appointments });

    } catch (error) {
        console.error('Ошибка при подключении к базе данных или получении данных:', error);
        response.status(500).send('Ошибка при работе с базой данных');
    }
});

// Получение записей по маршруту
app.get("/:choice", function (request, response) {
    console.log(`Получаем записи для ${request.params.choice}`);
    MongoClient.connect(dbUrl, { useUnifiedTopology: true }, function (error, database) {
        if (error) {
            console.error('Не удалось подключиться к базе данных', error);
            return response.status(500).send('Не удалось подключиться к базе данных');
        }

        const db = database.db('barbershop');
        db.collection('appointments').find().toArray(function (err, appointments) {
            if (err) {
                console.error('Не удалось получить записи', err);
                return response.status(500).send('Не удалось получить записи');
            }
            console.log('Записи получены', appointments);
            response.send(appointments);
        });
    });
});

app.post('/:choice', function (request, response) {
    console.log('Полученные данные для записи:', request.body);

    const { 'service-price': price, 'service-duration': duration, 'service-type': type, name, time, mobile } = request.body;

    // Логирование всех данных
    console.log('Параметры, полученные на сервере:', { price, duration, type, name, time, mobile });

    // Проверка на пустые или некорректные данные
    if (!price || !duration || !type || !name || !time || !mobile) {
        console.error('Некорректные данные:', { price, duration, type, name, time, mobile });
        return response.send('Некорректные параметры.');
    }

    MongoClient.connect(dbUrl, { useUnifiedTopology: true }, function (error, database) {
        if (error) {
            console.error('Не удалось подключиться к базе данных', error);
            return response.status(500).send('Не удалось подключиться к базе данных');
        }

        const db = database.db('barbershop');
        
        // Преобразуем price и duration в числа
        const priceNum = Number(price);
        const durationNum = Number(duration);

        console.log('Параметры услуги:', { price: priceNum, duration: durationNum, type });

        // Проверка на занятость времени
        const startTime = Number(time);

        db.collection('appointments').findOne({
            $and: [
                { start_time: startTime }, // Проверка по времени
                { type: type } // Проверка по типу услуги
            ]
        }, function (error, existingAppointment) {
            if (error) {
                console.error('Ошибка при поиске записей', error);
                return response.status(500).send('Ошибка при проверке времени');
            }

            if (existingAppointment) {
                console.warn('Время уже занято для услуги:', { time, type });
                return response.send('Это время уже занято, выберите другое.');
            }

            // Если время свободно, добавляем запись
            console.log('Добавляем запись:', {
                name, start_time: startTime, duration: durationNum, phone: mobile
            });

            const appointment = {
                name: name,
                start_time: startTime,
                duration: durationNum,
                type: type,
                phone: mobile
            };

            db.collection('appointments').insertOne(appointment, function (error, result) {
                if (error) {
                    console.error('Ошибка при добавлении записи в базу данных', error);
                    return response.status(500).send('Не удалось записать прием');
                }
                console.log('Запись успешно добавлена');
                response.send('Вы успешно записались на прием!');
            });
        });
    });
});

app.listen(8000, function () {
    console.log('Сервер работает на http://localhost:8000');
});
