const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { addUser, getUserByName } = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, password, phone } = req.body;
  const user = getUserByName(name);
  if (user) {
    return res.status(400).send('Пользователь с таким именем уже существует');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  addUser({ name, password: hashedPassword, phone });
  res.status(201).send('Пользователь зарегистрирован');
});

router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  const user = getUserByName(name);
  if (!user) {
    return res.status(400).send('Пользователь не найден');
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(400).send('Неверный пароль');
  }
  const token = jwt.sign({ userId: user.name }, 'secret', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
