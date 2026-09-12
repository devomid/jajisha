const express = require("express");
const router = express.Router();
const { getUser, signUpUser, signInUser } = require("../controllers/userController");
const authorize = require("../middlewares/authorizer");

router.get('/returnMe', authorize, getUser);
router.post('/su', signUpUser);
router.post('/si', signInUser);

module.exports = router;