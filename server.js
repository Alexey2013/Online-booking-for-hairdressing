const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const NumberLong = require('mongodb').Long;

const mongojs = require('mongojs');
const database = mongojs('barbershop');

const app = express();
app.set("view engine", "ejs");

const urlencodedParser = bodyParser.urlencoded({extended: false});
var path = require("path");

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(request, response) {
    database.collection('services').find(function (error, data) {
        database.collection('appointments').find(function (error, orders) {
            response.render('index.ejs', {
                services: data,
                appointments : orders
            });
        });
    });
});

app.get("/:choice", function(request, response) {
    database.collection('appointments').find(function (err, orders) {
        response.send(orders);
    });
})

app.post('/:choice', urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);

    database.collection('services').findOne( { service_price: request.body.price,
                                               service_time: NumberLong(request.body.duration),
                                               service_type: request.body.type }, function(error, doc) {
        if (doc) {
            var appointment = {
                surname: request.body.surname,
                name: request.body.name,
                start_time: NumberLong(request.body.time),
                duration: NumberLong(request.body.duration),
                type: request.body.type,
                phone: request.body.mobile
            }

            db.collection('appointments').insertOne(appointment, function (error, result) {
                if (error) return response.sendStatus(500);
            });

            var ref = "/";
            response.send('Данные успешно отправлены на сервер. Чтобы вернуться на сайт, перейдите по ссылке <a href=' + ref + '>ссылке</a>');
        } else {
            response.send('Сервером были получены некорректные параметры.' );
        }
    });
})

MongoClient.connect('mongodb://localhost:27017/barbershop', { useUnifiedTopology: true }, function (error, database) {
    if (error) return console.log(error);
    db = database.db('barbershop');
    app.listen(3333, function () {
        console.log('Сервер запущен на порту 3333. База данных на порту 27017.');
    });
}); 
