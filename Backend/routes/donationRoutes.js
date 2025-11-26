const express = require("express");
const Donation = require("../models/Donation");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// =======================
// Ensure uploads folder exists
// =======================
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// =======================
// Multer Storage
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// =======================
// CONTROLLERS
// =======================
const donationController = {
  submitDonation: async (req, res) => {
    try {
      const farmerId = req.user?.id;
      if (!farmerId) return res.status(401).json({ message: "Unauthorized" });

      const {
        bankAccountNo,
        IFSCCode,
        bankHolderName,
        bankName,
        branchName,
        donationPurpose,
        amountNeeded,
        note,
      } = req.body;

      const images = req.files?.map((file) => file.filename) || [];

      const donation = await Donation.create({
        farmerId,
        images,
        accountNumber: bankAccountNo,
        ifscCode: IFSCCode,
        bankHolderName,
        bankName,
        branchName,
        donationPurpose,
        amountRequired: amountNeeded,
        note: note || "",
      });

      res.status(201).json({
        message: "Donation submitted successfully",
        donation,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },

  getDonations: async (req, res) => {
    try {
      const donations = await Donation.find().populate(
        "farmerId",
        "name email phone"
      );
      res.status(200).json(donations);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getDonationById: async (req, res) => {
    try {
      const donation = await Donation.findById(req.params.id).populate(
        "farmerId",
        "name email phone"
      );

      if (!donation)
        return res.status(404).json({ message: "Donation not found" });

      res.status(200).json(donation);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

// =======================
// ROUTES
// =======================

// Submit donation (Farmer)
router.post(
  "/submit",
  authMiddleware,
  upload.array("images", 10),
  donationController.submitDonation
);

// Get logged-in farmer’s donations
router.get("/my-donations", authMiddleware, async (req, res) => {
  try {
    const donations = await Donation.find({ farmerId: req.user.id });

    const updated = donations.map((donation) => ({
      ...donation._doc,
      images: donation.images.map(
        (img) => `${req.protocol}://${req.get("host")}/uploads/${img}`
      ),
    }));

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Admin - Get all donations
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  donationController.getDonations
);

// Admin - Get donation by ID
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  donationController.getDonationById
);

// ============================
// ADMIN — Accept / Reject Donation
// ============================
router.put("/:id/status", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation)
      return res.status(404).json({ message: "Donation not found" });

    // If rejecting — ALWAYS reset fund distribution
    if (status === "rejected") {
      donation.fundDistributed = false;
      donation.fundDistributedAt = null;
    }

    donation.status = status;
    await donation.save();

    res.status(200).json({ message: "Status updated", donation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================
// ADMIN — FUND DISTRIBUTION
// =======================
router.put(
  "/fund-distribute/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const donation = await Donation.findById(req.params.id);

      if (!donation)
        return res.status(404).json({ message: "Donation not found" });

      if (donation.status !== "approved") {
        return res.status(400).json({
          message: "Only approved donations can be marked as distributed",
        });
      }

      donation.fundDistributed = true;
      donation.fundDistributedAt = new Date();
      await donation.save();

      res.status(200).json({
        message: "Fund distribution updated successfully",
        donation,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
