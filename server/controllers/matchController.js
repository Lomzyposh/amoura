const Match = require("../models/Match");

exports.getMatches = async (req, res) => {
  try {
    const userId = req.user;

    const matches = await Match.find({
      users: userId,
    })
      .populate("users", "name photos")
      .sort({ lastMessageAt: -1 });

    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
