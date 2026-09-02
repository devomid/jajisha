const express = require("express");
const router = express.Router();
const { saveToilet, unsaveToilet } = require("../controllers/managementController");

router.patch('/:userId/savedToilets/:toiletId', saveToilet);
router.delete('/:userId/savedToilets/:toiletId', unsaveToilet);

module.exports = router;