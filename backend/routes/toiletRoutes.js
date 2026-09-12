const express = require('express');
const router = express.Router();
const { createToilet, getToilets, getToiletReviews } = require('../controllers/toiletController');
const authorize = require("../middlewares/authorizer");


router.post('/', authorize, createToilet);
router.get('/', getToilets);
router.get('/reviews/:toiletId', getToiletReviews);


module.exports = router;