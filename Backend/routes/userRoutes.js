// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    // Optional: Restrict to admins only
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Update profile
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, email, password } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { name, email, ...(password && { password }) } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
