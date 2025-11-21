const mongoose = require("mongoose");

const { Schema } = mongoose;

const SwipeSchema = new Schema(
  {
    fromUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    direction: {
      type: String,
      enum: ["like", "pass", "superlike"],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Prevent duplicate swipe combos
SwipeSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

const Swipe = mongoose.models.Swipe || mongoose.model("Swipe", SwipeSchema);

module.exports = Swipe;