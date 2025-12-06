const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  getMe,
  updateMe,
  getDiscoverFeed,
} = require("../controllers/userController");

// Get current logged-in user
router.get("/me", auth, getMe);

// Update current user (used by signup steps)
router.patch("/me", auth, updateMe);

// 👉 Discover feed (for Home swipe screen)
router.get("/discover", auth, getDiscoverFeed);

module.exports = router;