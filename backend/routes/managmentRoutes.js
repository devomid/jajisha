const express = require("express");
const router = express.Router();
const { saveToilet, unsaveToilet, createReview } = require("../controllers/managementController");
const authorize = require("../middlewares/authorizer")

router.patch('/saveToilets/:toiletId', authorize, saveToilet);
router.delete('/unSavedToilets/:toiletId', authorize, unsaveToilet);

router.post('/toiletManagement/:toiletId', authorize, createReview)

module.exports = router;