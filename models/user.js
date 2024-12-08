const fs = require('fs');
const path = './data/users.json';

// Функция для получения всех пользователей
const getUsers = () => {
  if (fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }
  return [];
};

// Функция для добавления нового пользователя
const addUser = (user) => {
  const users = getUsers();
  users.push(user);
  fs.writeFileSync(path, JSON.stringify(users, null, 2));
};

// Функция для поиска пользователя по имени
const getUserByName = (name) => {
  const users = getUsers();
  return users.find(user => user.name === name);
};

module.exports = { getUsers, addUser, getUserByName };
