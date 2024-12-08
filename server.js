const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { initializeDatabase } = require('./config/database');
const { getUserByName, addUser } = require('./models/user');
const { getServices } = require('./models/service');
const { getAppointments, addAppointment } = require('./models/appointment');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointment');
const serviceRoutes = require('./routes/service');

const app = express();
const port = 3000;

initializeDatabase();

app.use(bodyParser.json());
app.use(express.static('public'));

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
