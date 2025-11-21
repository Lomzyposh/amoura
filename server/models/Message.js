const mongoose = require("mongoose");

const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    match: { type: Schema.Types.ObjectId, ref: "Match", required: true },
    fromUser: { type: Schema.Types.ObjectId, ref: "User", required: true },

    text: { type: String, trim: true },
    imageUrl: { type: String },

    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Messages in a conversation, oldest → newest
MessageSchema.index({ match: 1, createdAt: 1 });

const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);

module.exports = Message;