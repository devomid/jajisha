const express = require('express');
const router = express.Router();
const { createToilet, getToilets } = require('../controllers/toiletController');


router.post('/:userId', createToilet);
router.get('/', getToilets);


module.exports = router;