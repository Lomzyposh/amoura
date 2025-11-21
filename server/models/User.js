const mongoose = require("mongoose");

const { Schema } = mongoose;

const PhotoSchema = new Schema(
  {
    url: { type: String, required: true },
    order: { type: Number, default: 0 }, // 0 = main photo
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: { type: String, required: true },

    // Now OPTIONAL – filled in at Step 2 via /api/users/me
    dob: {
      type: Date,
      required: false,
    },

    // Now OPTIONAL – filled in at Step 3
    gender: {
      type: String,
      enum: ["male", "female", "nonbinary", "other"],
      required: false,
      default: "other",
    },

    // Preference – set at Step 4
    interestedIn: {
      type: [String],
      enum: ["male", "female", "everyone"],
      default: ["everyone"],
    },

    // Step 7 bio
    bio: {
      type: String,
      maxlength: 200,
    },

    // Step 6 photos
    photos: {
      type: [PhotoSchema],
      default: [],
    },

    // Step 5 hobbies/interests
    interests: {
      type: [String],
      default: [],
    },

    // Optional location (can be set later)
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [lng, lat] = [longitude, latitude]
      },
    },

    // Track where they are in onboarding (0 = just created, 1 = after Step1, etc.)
    onboardingStep: { type: Number, default: 1 },

    isVerified: { type: Boolean, default: false },

    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ location: "2dsphere" });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;