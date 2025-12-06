const User = require("../models/User");
const Swipe = require("../models/Swipe");
const Block = require("../models/Block");
// GET /api/users/me
exports.getMe = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /api/users/me
exports.updateMe = async (req, res) => {
  try {
    const userId = req.user;
    const body = req.body;

    // Only allow these fields to be updated
    const allowedFields = [
      "name",
      "dob",
      "gender",
      "interestedIn",
      "bio",
      "interests",
      "photos",
      "location",
      "onboardingStep",
    ];

    const update = {};

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        update[field] = body[field];
      }
    });

    // Convert dob if it's sent as string
    if (update.dob) {
      update.dob = new Date(update.dob);
    }

    // If location is sent as { lng, lat }, convert to GeoJSON
    if (body.location && body.location.lng && body.location.lat) {
      update.location = {
        type: "Point",
        coordinates: [body.location.lng, body.location.lat],
      };
    }

    const user = await User.findByIdAndUpdate(userId, update, {
      new: true,
    }).select("-passwordHash");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// // GET /api/users/discover
// // Returns a list of profiles you haven't swiped on yet, based on your preferences
// exports.getDiscoverFeed = async (req, res) => {
//   try {
//     const userId = req.user;

//     const me = await User.findById(userId);
//     if (!me) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // IDs you should NOT see again
//     const [alreadySwipedIds, blockedIds] = await Promise.all([
//       Swipe.find({ fromUser: userId }).distinct("toUser"),
//       Block.find({ blocker: userId }).distinct("blocked"),
//     ]);

//     const excludeIds = [
//       userId,
//       ...alreadySwipedIds.map(String),
//       ...blockedIds.map(String),
//     ];

//     const query = {
//       _id: { $nin: excludeIds },
//       "photos.0": { $exists: true }, // must have at least one photo
//     };

//     // Match who you’re interested in
//     // interestedIn: ["men", "women", "everyone"]
//     if (me.interestedIn && me.interestedIn.length > 0) {
//       if (!me.interestedIn.includes("everyone")) {
//         query.gender = { $in: me.interestedIn };
//       }
//       // if "everyone", we don't filter on gender
//     }

//     // Optionally also respect their interest in you:
//     if (me.gender) {
//       query.interestedIn = { $in: [me.gender, "everyone"] };
//     }

//     const candidates = await User.find(query)
//       .select("name dob gender bio photos location")
//       .sort({ createdAt: -1 })
//       .limit(25);

//     res.json(candidates);
//   } catch (err) {
//     console.error("Discover feed error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// GET /api/users/discover
// TEMP VERSION: show everyone except me
exports.getDiscoverFeed = async (req, res) => {
  try {
    const userId = req.user;

    // Show all other users who have at least one photo
    const users = await User.find({
      _id: { $ne: userId },
      "photos.0": { $exists: true },
    })
      .select("name dob gender bio photos location")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(users);
  } catch (err) {
    console.error("Discover feed error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
