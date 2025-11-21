const mongoose = require("mongoose");

const { Schema } = mongoose;

const BlockSchema = new Schema(
  {
    blocker: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blocked: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// One block record per pair
BlockSchema.index({ blocker: 1, blocked: 1 }, { unique: true });

const Block = mongoose.models.Block || mongoose.model("Block", BlockSchema);

module.exports = Block;
