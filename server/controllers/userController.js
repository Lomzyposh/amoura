const User = require("../models/User");

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
