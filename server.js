const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const mongojs = require('mongojs');

const app = express();
app.set("view engine", "ejs");

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const database = mongojs('barbershop');

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (request, response) {
    database.collection('services').find(function (error, services) {
        database.collection('appointments').find(function (error, appointments) {
            response.render('index.ejs', {
                services: services,
                appointments: appointments
            });
        });
    });
});

app.get("/:choice", function (request, response) {
    database.collection('appointments').find(function (err, appointments) {
        response.send(appointments);
    });
});

app.post('/:choice', urlencodedParser, function (request, response) {
    if (!request.body) return response.sendStatus(400);

    database.collection('services').findOne({
        service_price: request.body.price,
        service_time: Number(request.body.duration),
        service_type: request.body.type
    }, function (error, service) {
        if (service) {
            var appointment = {
                name: request.body.name,
                start_time: Number(request.body.time),
                duration: Number(request.body.duration),
                type: request.body.type,
                phone: request.body.mobile
            };

            database.collection('appointments').insertOne(appointment, function (error, result) {
                if (error) return response.sendStatus(500);
            });

            response.send('Data successfully sent to the server. To return to the site, click <a href="/">here</a>');
        } else {
            response.send('The server received incorrect parameters.');
        }
    });
});

MongoClient.connect('mongodb://localhost:27017/barbershop', { useUnifiedTopology: true }, function (error, database) {
    if (error) return console.log(error);
    db = database.db('barbershop');
    app.listen(8000, function () {
        console.log('Server is running on http://localhost:8000. Database is on port 27017.');
    });
});
