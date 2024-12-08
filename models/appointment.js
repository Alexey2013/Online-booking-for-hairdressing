const fs = require('fs');
const path = './data/appointments.json';

// Функция для получения всех записей
const getAppointments = () => {
  if (fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }
  return [];
};

// Функция для добавления новой записи
const addAppointment = (appointment) => {
  const appointments = getAppointments();
  appointments.push(appointment);
  fs.writeFileSync(path, JSON.stringify(appointments, null, 2));
};

module.exports = { getAppointments, addAppointment };

