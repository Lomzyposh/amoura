const mongoose = require("mongoose");

const { Schema } = mongoose;

const MatchSchema = new Schema(
  {
    users: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 2,
        message: "Match must contain exactly 2 users.",
      },
      required: true,
    },
    lastMessageAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Look up matches for a user
MatchSchema.index({ users: 1 });

// Sort chats by recent activity
MatchSchema.index({ lastMessageAt: -1 });

const Match = mongoose.models.Match || mongoose.model("Match", MatchSchema);

module.exports = Match;
