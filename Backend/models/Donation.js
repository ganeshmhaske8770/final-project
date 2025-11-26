  // models/Donation.js
  const mongoose = require("mongoose");

  const donationSchema = new mongoose.Schema(
    {
      farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      images: {
        type: [String],
        required: true,
      },

      accountNumber: {
        type: String,
        required: true,
      },

      ifscCode: {
        type: String,
        required: true,
      },

      bankHolderName: {
        type: String,
        required: true,
      },

      bankName: {
        type: String,
        required: true,
      },

      branchName: {
        type: String,
        required: true,
      },

      donationPurpose: {
        type: String,
        required: true,
      },

      amountRequired: {
        type: Number,
        required: true,
      },

      note: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },

      // ⭐ NEW FIELD ADDED ⭐
      fundDistributed: {
        type: Boolean,
        default: false,
      },

      fundDistributedAt: {
        type: Date,
        default: null,
      },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Donation", donationSchema);
