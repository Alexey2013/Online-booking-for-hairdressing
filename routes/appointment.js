const express = require('express');
const jwt = require('jsonwebtoken');
const { getAppointments, addAppointment } = require('../models/appointment');

const router = express.Router();

// Функция для проверки авторизации
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Необходима авторизация');
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) return res.status(403).send('Необходима авторизация');
    req.userId = decoded.userId;
    next();
  });
};

// Получение всех записей
router.get('/', (req, res) => {
  const appointments = getAppointments();
  res.json(appointments);
});

// Запись на прием
router.post('/', verifyToken, (req, res) => {
  const { serviceId, time, name, phone } = req.body;
  const appointments = getAppointments();
  const newAppointment = { serviceId, time, name, phone };
  addAppointment(newAppointment);
  res.status(201).send('Запись создана');
});

module.exports = router;
