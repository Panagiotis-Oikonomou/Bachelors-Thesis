const express = require('express');
const router = express.Router();
const criteria = require('../controllers/criteriaController');
const ver = require('../middleware/authMiddleware');

router.put("/", ver.verify, criteria.updateCriteria);
router.get("/", ver.verify, criteria.getCriteria);
router.get("/my_offers", ver.verify, criteria.getMyOffers);

module.exports = router;