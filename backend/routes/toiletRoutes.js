const express = require('express');
const router = express.Router();
const { createToilet } = require('../controllers/toiletController');


router.post('/', createToilet);


module.exports = router;