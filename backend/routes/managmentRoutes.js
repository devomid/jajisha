const express = require("express");
const router = express.Router();
const { saveToilet, unsaveToilet, createReview } = require("../controllers/managementController");

router.patch('/:userId/savedToilets/:toiletId', saveToilet);
router.delete('/:userId/savedToilets/:toiletId', unsaveToilet);

router.post('/:userId/toiletManagement/:toiletId', createReview)

module.exports = router;