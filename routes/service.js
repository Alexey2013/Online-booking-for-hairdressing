const express = require('express');
const { getServices } = require('../models/service');

const router = express.Router();

router.get('/', (req, res) => {
  const services = getServices();
  res.json(services);
});

module.exports = router;
