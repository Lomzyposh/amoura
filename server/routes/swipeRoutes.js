const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { swipe } = require("../controllers/swipeController");

router.post("/", auth, swipe);

module.exports = router;