const Message = require("../models/Message");
const Match = require("../models/Match");

// POST /api/messages/:matchId
exports.sendMessage = async (req, res) => {
  try {
    const matchId = req.params.matchId;
    const fromUser = req.user;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const msg = await Message.create({
      match: matchId,
      fromUser,
      text: text.trim(),
    });

    await Match.findByIdAndUpdate(matchId, {
      lastMessageAt: new Date(),
    });

    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/messages/:matchId
exports.getMessages = async (req, res) => {
  try {
    const matchId = req.params.matchId;

    const messages = await Message.find({ match: matchId }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};