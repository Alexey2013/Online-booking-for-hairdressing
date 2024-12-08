const fs = require('fs');

const initializeDatabase = () => {
  // Инициализация файлов базы данных, если они не существуют
  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
  }

  if (!fs.existsSync('./data/users.json')) {
    fs.writeFileSync('./data/users.json', JSON.stringify([]));
  }

  if (!fs.existsSync('./data/services.json')) {
    const defaultServices = [
      { id: 1, name: "Стрижка", duration: 30, price: 500 },
      { id: 2, name: "Маникюр", duration: 45, price: 700 },
      { id: 3, name: "Укладка", duration: 40, price: 600 }
    ];
    fs.writeFileSync('./data/services.json', JSON.stringify(defaultServices, null, 2));
  }

  if (!fs.existsSync('./data/appointments.json')) {
    fs.writeFileSync('./data/appointments.json', JSON.stringify([]));
  }
};

module.exports = { initializeDatabase };
