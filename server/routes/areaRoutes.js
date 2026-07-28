const express = require('express');
const router = express.Router();
const area = require('../controllers/areaController');
const ver = require('../middleware/authMiddleware');

router.post("/", ver.verify, area.addArea);
router.get("/", ver.verify, area.getAreas);
router.get("/:id", ver.verify, area.getArea);
router.get("/coordinates/:chatid", ver.verify, area.getAreaCoordinates);
router.delete("/:id", ver.verify, area.deleteArea);
router.put("/:id", ver.verify, area.updateArea);

module.exports = router;