const Swipe = require("../models/Swipe");
const Match = require("../models/Match");

exports.swipe = async (req, res) => {
  try {
    const { toUser, direction } = req.body;
    const fromUser = req.user;

    const swipe = await Swipe.findOneAndUpdate(
      { fromUser, toUser },
      { direction },
      { upsert: true, new: true }
    );

    const reverse = await Swipe.findOne({
      fromUser: toUser,
      toUser: fromUser,
      direction: "like",
    });

    let matched = false;

    if (direction === "like" && reverse) {
      matched = await Match.create({
        users: [fromUser, toUser],
        lastMessageAt: new Date(),
      });
    }

    res.json({ swipe, matched });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

