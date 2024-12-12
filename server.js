const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const app = express();
const databaseUrl = 'mongodb://localhost:27017/database';
app.set('views', path.join(__dirname, 'public'));
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", async function (req, res) {
    try {
        const connection = await MongoClient.connect(databaseUrl, { useUnifiedTopology: true });
        const db = connection.db('database');
        const servicesList = await db.collection('services').find().sort({ service_price: 1 }).toArray();
        const appointmentsList = await db.collection('appointments').find().toArray();

        res.render('index.ejs', { services: servicesList, appointments: appointmentsList });
    } catch (err) {
        res.status(500).send('Ошибка базы данных');
    }
});

app.get("/:category", function (req, res) {
    MongoClient.connect(databaseUrl, { useUnifiedTopology: true }, function (err, connection) {
        if (err) {
            return res.status(500).send('Ошибка подключения к базе данных');
        }

        const db = connection.db('database');
        db.collection('appointments').find().toArray(function (err, appointmentsList) {
            if (err) {
                return res.status(500).send('Не удалось получить записи');
            }
            res.send(appointmentsList);
        });
    });
});

app.post('/:category', function (req, res) {
    const { 'service-price': price, 'service-duration': duration, 'service-type': type, name, time, mobile } = req.body;

    if (!price || !duration || !type || !name || !time || !mobile) {
        return res.send('Некорректные параметры.');
    }

    MongoClient.connect(databaseUrl, { useUnifiedTopology: true }, function (err, connection) {
        if (err) {
            return res.status(500).send('Ошибка подключения к базе данных');
        }

        const db = connection.db('database');
        const priceNumber = Number(price);
        const durationNumber = Number(duration);
        const timeParts = time.split(':');
        const appointmentTime = Number(timeParts[0]) * 60 + Number(timeParts[1]);

        db.collection('appointments').findOne({
            $and: [
                { start_time: appointmentTime },
                { type: type }
            ]
        }, function (err, existingAppointment) {
            if (err) {
                return res.status(500).send('Ошибка проверки времени');
            }

            if (existingAppointment) {
                return res.send('Этот временной интервал уже занят, выберите другое время.');
            }

            const newAppointment = {
                name: name,
                start_time: appointmentTime,
                duration: durationNumber,
                type: type,
                phone: mobile
            };

            db.collection('appointments').insertOne(newAppointment, function (err, result) {
                if (err) {
                    return res.status(500).send('Не удалось записаться на прием');
                }
                const endTime = appointmentTime + durationNumber;
                res.send(`Запись успешно оформлена `);
            });
        });
    });
});

app.listen(8000, function () {
    console.log('Сервер работает на http://localhost:8000');
});
