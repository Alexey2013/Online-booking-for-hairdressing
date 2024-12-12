const express = require('express');const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const app = express();
const databaseUrl = 'mongodb://localhost:27017/database';
app.set('views', path.join(__dirname, 'client'));
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'client')));

app.get("/", async function (req, res) {
    try {
        const connection = await MongoClient.connect(databaseUrl, { useUnifiedTopology: true });
        const db = connection.db('database');
        const servicesList = await db.collection('services').find().sort({ service_price: 1 }).toArray();
        const appointmentsList = await db.collection('appointments').find().toArray();

        res.render('index.ejs', { services: servicesList, appointments: appointmentsList });
    } catch (err) {
        res.send('Database error');
    }
});

app.get("/:category", async function (req, res) {
    try {
        const connection = await MongoClient.connect(databaseUrl, { useUnifiedTopology: true });
        const db = connection.db('database');
        const appointmentsList = await db.collection('appointments').find().toArray();

        res.send(appointmentsList);
    } catch (err) {
        res.send('Failed to retrieve appointments');
    }
});

app.post('/:category', async function (req, res) {
    const { 'service-price': price, 'service-duration': duration, 'service-type': type, name, time, mobile } = req.body;

    if (!price || !duration || !type || !name || !time || !mobile) {
        return res.send('Invalid parameters.');
    }

    try {
        const connection = await MongoClient.connect(databaseUrl, { useUnifiedTopology: true });
        const db = connection.db('database');
        const priceNumber = Number(price);
        const durationNumber = Number(duration);
        const timeParts = time.split(':');
        const appointmentTime = Number(timeParts[0]) * 60 + Number(timeParts[1]);

        const existingAppointment = await db.collection('appointments').findOne({
            $and: [
                { start_time: appointmentTime },
                { type: type }
            ]
        });

        if (existingAppointment) {
            return res.send('This time slot is already booked, please choose another time.');
        }

        const newAppointment = {
            name: name,
            start_time: appointmentTime,
            duration: durationNumber,
            type: type,
            phone: mobile
        };

        await db.collection('appointments').insertOne(newAppointment);
        const endTime = appointmentTime + durationNumber;
        res.send('Appointment booked successfully');
    } catch (err) {
        res.send('Failed to book appointment');
    }
});

app.listen(8000, function () {
    console.log('Server is running on http://localhost:8000');
});
