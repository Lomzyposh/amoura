// routes/messageRoutes.js
const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

// Send a message in a match
router.post("/:matchId", auth, sendMessage);

// Get messages for a match
router.get("/:matchId", auth, getMessages);

module.exports = router;