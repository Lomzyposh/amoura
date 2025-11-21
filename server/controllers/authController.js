const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, dob, gender, interestedIn } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash: hash,
      dob: dob ? new Date(dob) : undefined,
      gender: gender || "other",
      interestedIn: interestedIn || ["everyone"],
      onboardingStep: 1,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ user, token });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
