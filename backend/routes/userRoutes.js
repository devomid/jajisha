const express = require("express");
const router = express.Router();
const { getUser, signUpUser, signInUser, saveToilet, unsaveToilet } = require("../controllers/userController");

router.get('/:id', getUser);
router.post('/su', signUpUser);
router.post('/si', signInUser);
router.patch('/:userId/savedToilets/:toiletId', saveToilet);
router.delete('/:userId/savedToilets/:toiletId', unsaveToilet);

module.exports = router;