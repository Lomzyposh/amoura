const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { getMe, updateMe } = require("../controllers/userController");

// Get current logged-in user
router.get("/me", auth, getMe);

// Update current user (used by signup steps)
router.patch("/me", auth, updateMe);

module.exports = router;