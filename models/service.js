const fs = require('fs');
const path = './data/services.json';

// Функция для получения всех услуг
const getServices = () => {
  if (fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }
  return [];
};

module.exports = { getServices };
