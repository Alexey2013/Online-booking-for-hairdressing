const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');

const app = express();
app.set('views', path.join(__dirname, 'public')); 

// Используем встроенный middleware Express для парсинга URL-кодированных данных
app.use(express.urlencoded({ extended: false }));

// URL для подключения к базе данных
const dbUrl = 'mongodb://localhost:27017/barbershop';

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", async function (request, response) {
    try {
        const database = await MongoClient.connect(dbUrl, { useUnifiedTopology: true });
        const db = database.db('barbershop');

        const services = await db.collection('services').find().sort({ service_price: 1 }).toArray();

        const appointments = await db.collection('appointments').find().toArray();

        response.render('index.ejs', { services: services, appointments: appointments });

    } catch (error) {
        console.error('Ошибка при подключении к базе данных или получении данных:', error);
        response.status(500).send('Ошибка при работе с базой данных');
    }
});

app.get("/:choice", function (request, response) {
    MongoClient.connect(dbUrl, { useUnifiedTopology: true }, function (error, database) {
        if (error) return response.status(500).send('Не удалось подключиться к базе данных');
        
        const db = database.db('barbershop');
        db.collection('appointments').find().toArray(function (err, appointments) {
            if (err) return response.status(500).send('Не удалось получить записи');
            response.send(appointments);
        });
    });
});

app.post('/:choice', function (request, response) {
    if (!request.body) return response.sendStatus(400);

    MongoClient.connect(dbUrl, { useUnifiedTopology: true }, function (error, database) {
        if (error) return response.status(500).send('Не удалось подключиться к базе данных');
        
        const db = database.db('barbershop');
        db.collection('services').findOne({
            service_price: request.body.price,
            service_time: Number(request.body.duration),
            service_type: request.body.type
        }, function (error, service) {
            if (error) return response.status(500).send('Не удалось найти услугу');
            
            if (service) {
                const appointment = {
                    name: request.body.name,
                    start_time: Number(request.body.time),
                    duration: Number(request.body.duration),
                    type: request.body.type,
                    phone: request.body.mobile
                };

                db.collection('appointments').insertOne(appointment, function (error, result) {
                    if (error) return response.status(500).send('Не удалось записать прием');
                    response.send('Вы успешно записались на прием!');
                });
            } else {
                response.send('Некорректные параметры.');
            }
        });
    });
});

app.listen(8000, function () {
    console.log('Сервер работает на http://localhost:8000');
});