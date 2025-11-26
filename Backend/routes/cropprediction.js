// routes/cropPrediction.js
const router = require("express").Router();
const CropPrediction = require("../models/CropPrediction");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

// ============================
// Get all predictions (Farmer + Admin)
// ============================
router.get("/", authMiddleware, authorizeRoles("farmer", "admin"), async (req, res) => {
  try {
    const predictions = await CropPrediction.find();
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching crop predictions" });
  }
});

// ============================
// Get single prediction by ID (Farmer only)
// ============================
router.get("/:id", authMiddleware, authorizeRoles("farmer"), async (req, res) => {
  try {
    const prediction = await CropPrediction.findById(req.params.id);
    if (!prediction) return res.status(404).json({ message: "Prediction not found" });
    res.json(prediction);
  } catch (err) {
    res.status(500).json({ error: "Error fetching prediction" });
  }
});

// ============================
// Add new prediction (Admin only)
// ============================
router.post("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const {
      soilPh,
      waterAvailability,
      season,
      soilType,
      growingPeriod,
      recommendedCrops,
      description,
      fertilizers
    } = req.body;

    const prediction = await CropPrediction.create({
      soilPh,
      waterAvailability,
      season,
      soilType,
      growingPeriod,
      recommendedCrops,
      description,
      fertilizers
    });

    res.json(prediction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================
// Update prediction (Admin only)
// ============================
router.put("/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const {
      soilPh,
      waterAvailability,
      season,
      soilType,
      growingPeriod,
      recommendedCrops,
      description,
      fertilizers
    } = req.body;

    const prediction = await CropPrediction.findByIdAndUpdate(
      req.params.id,
      {
        soilPh,
        waterAvailability,
        season,
        soilType,
        growingPeriod,
        recommendedCrops,
        description,
        fertilizers
      },
      { new: true, runValidators: true }
    );

    if (!prediction) return res.status(404).json({ message: "Prediction not found" });
    res.json(prediction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================
// Delete prediction (Admin only)
// ============================
router.delete("/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const prediction = await CropPrediction.findByIdAndDelete(req.params.id);
    if (!prediction) return res.status(404).json({ message: "Prediction not found" });
    res.json({ message: "Prediction deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting prediction" });
  }
});

module.exports = router;
