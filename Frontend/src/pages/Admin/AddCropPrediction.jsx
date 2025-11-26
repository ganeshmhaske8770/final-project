import { useState } from "react";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const AddPrediction = () => {
  const [formData, setFormData] = useState({
    soilPh: "",
    waterAvailability: "Medium",
    season: "Summer",
    soilType: "Loamy",
    growingPeriod: "Medium",
    description: "",
    fertilizers: "",
    recommendedCrops: [{ name: "", priority: 1, imageUrl: "" }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCropChange = (index, field, value) => {
    const updated = [...formData.recommendedCrops];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, recommendedCrops: updated }));
  };

  const addCropField = () => {
    setFormData((prev) => ({
      ...prev,
      recommendedCrops: [
        ...prev.recommendedCrops,
        { name: "", priority: 2, imageUrl: "" },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/cropprediction", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Prediction added successfully!");
      setFormData({
        soilPh: "",
        waterAvailability: "Medium",
        season: "Summer",
        soilType: "Loamy",
        growingPeriod: "Medium",
        description: "",
        fertilizers: "",
        recommendedCrops: [{ name: "", priority: 1, imageUrl: "" }],
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Error adding prediction");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
  };

  const buttonHover = { scale: 1.05 };
  const buttonTap = { scale: 0.95 };

  return (
    <motion.div
      className="max-w-2xl mx-auto p-6 bg-white shadow rounded"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-xl font-bold mb-4 text-green-700"
        variants={itemVariants}
      >
        Add Crop Prediction
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        variants={containerVariants}
      >
        {/* Soil PH */}
        <motion.div variants={itemVariants}>
          <label className="block font-medium">Soil pH (4 - 9)</label>
          <input
            type="number"
            name="soilPh"
            value={formData.soilPh}
            onChange={handleChange}
            required
            min="4"
            max="9"
            className="border p-2 w-full rounded"
          />
        </motion.div>

        {/* Water Availability */}
        <motion.div variants={itemVariants}>
          <label className="block font-medium">Water Availability</label>
          <select
            name="waterAvailability"
            value={formData.waterAvailability}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </motion.div>

        {/* Season */}
        <motion.div variants={itemVariants}>
          <label className="block font-medium">Season</label>
          <select
            name="season"
            value={formData.season}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option>Winter</option>
            <option>Monsoon</option>
            <option>Summer</option>
          </select>
        </motion.div>

        {/* Soil Type */}
        <motion.div variants={itemVariants}>
          <label className="block font-medium">Soil Type</label>
          <select
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option>Sandy</option>
            <option>Loamy</option>
            <option>Clay</option>
            <option>Black</option>
            <option>Alluvial</option>
          </select>
        </motion.div>

        {/* Growing Period */}
        <motion.div variants={itemVariants}>
          <label className="block font-medium">Growing Period</label>
          <select
            name="growingPeriod"
            value={formData.growingPeriod}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option>Short</option>
            <option>Medium</option>
            <option>Long</option>
          </select>
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants}>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter details about this crop prediction..."
            className="border p-2 w-full rounded h-24"
            required
          />
        </motion.div>

        {/* Fertilizers */}
        <motion.div variants={itemVariants}>
          <label className="block font-medium">Recommended Fertilizers</label>
          <textarea
            name="fertilizers"
            value={formData.fertilizers}
            onChange={handleChange}
            placeholder="List fertilizers (comma separated or detailed info)"
            className="border p-2 w-full rounded h-24"
            required
          />
        </motion.div>

        {/* Recommended Crops */}
        <motion.div variants={itemVariants}>
          <label className="block font-medium">Recommended Crops</label>
          <AnimatePresence>
            {formData.recommendedCrops.map((crop, index) => (
              <motion.div
                key={index}
                className="mb-4 p-3 border rounded"
                variants={itemVariants}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                layout
              >
                <input
                  type="text"
                  placeholder="Crop Name"
                  value={crop.name}
                  onChange={(e) =>
                    handleCropChange(index, "name", e.target.value)
                  }
                  className="border p-2 w-full rounded mb-2"
                  required
                />
                <select
                  value={crop.priority}
                  onChange={(e) =>
                    handleCropChange(index, "priority", Number(e.target.value))
                  }
                  className="border p-2 w-full rounded mb-2"
                >
                  <option value={1}>Best (1)</option>
                  <option value={2}>Alternative (2)</option>
                </select>
                <input
                  type="text"
                  placeholder="Image URL"
                  value={crop.imageUrl}
                  onChange={(e) =>
                    handleCropChange(index, "imageUrl", e.target.value)
                  }
                  className="border p-2 w-full rounded mb-2"
                />
                <AnimatePresence>
                  {crop.imageUrl && (
                    <motion.img
                      src={crop.imageUrl}
                      alt="Crop Preview"
                      className="w-32 h-32 object-cover rounded border"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.button
            type="button"
            onClick={addCropField}
            className="text-blue-600 mt-2"
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            + Add Another Crop
          </motion.button>
        </motion.div>

        {/* Submit */}
        <motion.button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          Save Prediction
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default AddPrediction;
