const mongoose = require("mongoose");

const { Schema } = mongoose;

const ReportSchema = new Schema(
  {
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reportedUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    details: { type: String },
    handled: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ReportSchema.index({ reportedUser: 1 });

const Report =
  mongoose.models.Report || mongoose.model("Report", ReportSchema);

module.exports = Report;