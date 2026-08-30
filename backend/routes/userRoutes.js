const express = require("express");
const router = express.Router();
const { getUser, signUpUser, signInUser } = require("../controllers/userController");

router.get('/:id', getUser);
router.post('/su', signUpUser);
router.post('/si', signInUser);

module.exports = router;