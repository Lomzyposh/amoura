const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../config/sendEmail");

exports.register = async (req, res) => {
  try {
    const { name, email, password, dob, gender, interestedIn } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Always respond success
    if (!user) {
      return res.json({
        message: "If an account exists with that email, a reset code was sent.",
      });
    }

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetCode = resetCode;
    user.resetCodeExpires = expires;
    await user.save();

    // Email HTML
    const html = `
      <h2>Your Amoura Password Reset Code</h2>
      <p>Use the code below to reset your password:</p>
      <h1 style="font-size: 32px; color: #E91E63;">${resetCode}</h1>
      <p>This code expires <strong>in 10 minutes</strong>.</p>
    `;

    // Send the email
    await sendEmail(user.email, "Your Amoura Reset Code", html);

    res.json({
      message: "If an account exists with that email, a reset code was sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (
      !user ||
      !user.resetCode ||
      !user.resetCodeExpires ||
      user.resetCode !== code ||
      user.resetCodeExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    return res.json({ message: "Code is valid" });
  } catch (err) {
    console.error("Verify reset code error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, code and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (
      !user ||
      !user.resetCode ||
      !user.resetCodeExpires ||
      user.resetCode !== code ||
      user.resetCodeExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    user.passwordHash = passwordHash;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;

    await user.save({ validateModifiedOnly: true });

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
