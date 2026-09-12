const express = require("express");
const router = express.Router();
const { getUser, signUpUser, signInUser } = require("../controllers/userController");
const authorize = require("../middlewares/authorizer");
const limiter = require('../middlewares/signLimiter')

router.get('/returnMe', authorize, getUser);
router.post('/su', limiter, signUpUser);
router.post('/si', limiter, signInUser);

module.exports = router;