import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiBarChart2 } from "react-icons/fi";

const CropPredictionForm = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    soilPh: "",
    waterAvailability: "",
    season: "",
    soilType: "",
    growingPeriod: "",
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [loading, setLoading] = useState(false);

  const fields = [
    { key: "soilPh", label: "Soil pH (Range: 4 - 9)", type: "number", placeholder: "Enter soil pH" },
    { key: "waterAvailability", label: "Water Availability", type: "select", options: ["Low", "Medium", "High"] },
    { key: "season", label: "Current Season", type: "select", options: ["Winter", "Monsoon", "Summer"] },
    { key: "soilType", label: "Soil Type", type: "select", options: ["Sandy", "Loamy", "Clay", "Black", "Alluvial"] },
    { key: "growingPeriod", label: "Expected Growing Period", type: "select", options: ["Short", "Medium", "Long"] },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [fields[step].key]: e.target.value });
  };

  const nextStep = () => {
    if (step < fields.length - 1) setStep(step + 1);
    else handleSubmit();
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  // ⭐ Filter only crops with priority 1 or 2
  const filterTopTwoPriorities = (data) => {
    return data
      .map((item) => ({
        ...item,
        recommendedCrops: item.recommendedCrops.filter(
          (crop) => crop.priority === 1 || crop.priority === 2
        ),
      }))
      .filter((item) => item.recommendedCrops.length > 0);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setPredictionResult(null);

      const response = await axios.get("http://localhost:5000/api/cropprediction", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const predictions = response.data;

      // ⭐⭐⭐ TIER LOGIC ⭐⭐⭐

      let perfectMatch = predictions.filter((p) => {
        return (
          Math.abs(p.soilPh - formData.soilPh) <= 1 &&
          p.waterAvailability === formData.waterAvailability &&
          p.season === formData.season &&
          p.soilType === formData.soilType &&
          p.growingPeriod === formData.growingPeriod
        );
      });

      let seasonWaterMatch = predictions.filter((p) => {
        return (
          p.waterAvailability === formData.waterAvailability &&
          p.season === formData.season
        );
      });

      let soilSeasonMatch = predictions.filter((p) => {
        return (
          Math.abs(p.soilPh - formData.soilPh) <= 1 &&
          p.season === formData.season
        );
      });

      // ⭐ APPLY PRIORITY FILTER TO EACH RESULT SET
      let finalResult;

      if (perfectMatch.length > 0) {
        finalResult = filterTopTwoPriorities(perfectMatch);
      } else if (seasonWaterMatch.length > 0) {
        finalResult = filterTopTwoPriorities(seasonWaterMatch);
      } else if (soilSeasonMatch.length > 0) {
        finalResult = filterTopTwoPriorities(soilSeasonMatch);
      } else {
        finalResult = "No suitable crop found. Try different values.";
      }

      setPredictionResult(finalResult);

    } catch (err) {
      console.error(err);
      setPredictionResult("Error fetching prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-xl mt-8 border border-green-200">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        🌾 Smart Crop Prediction
      </h2>

      {!predictionResult ? (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <label className="block text-lg font-semibold text-green-700 mb-3">
                {fields[step].label}
              </label>

              {fields[step].type === "select" ? (
                <select
                  name={fields[step].key}
                  value={formData[fields[step].key]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-xl text-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                >
                  <option value="">Select an option</option>
                  {fields[step].options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={fields[step].type}
                  name={fields[step].key}
                  value={formData[fields[step].key]}
                  onChange={handleChange}
                  placeholder={fields[step].placeholder}
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-xl text-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={step === 0}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold border-2 transition-all ${
                step === 0
                  ? "opacity-50 cursor-not-allowed border-gray-300"
                  : "border-green-400 text-green-700 hover:bg-green-100"
              }`}
            >
              <FiArrowLeft /> Back
            </button>

            <button
              onClick={nextStep}
              className={`flex items-center gap-2 px-5 py-2 text-white font-semibold rounded-lg transition-all ${
                step === fields.length - 1
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {step === fields.length - 1 ? (
                <>
                  <FiBarChart2 />
                  Predict Now
                </>
              ) : (
                <>
                  Next
                  <FiArrowRight />
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h3 className="text-xl font-semibold text-green-700 mb-4">Predicted Crops</h3>

          {loading ? (
            <p>Loading...</p>
          ) : typeof predictionResult === "string" ? (
            <p className="text-red-600">{predictionResult}</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {predictionResult.map((item, i) =>
                item.recommendedCrops.map((crop, index) => (
                  <motion.div
                    key={`${i}-${index}`}
                    className="border border-green-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    onClick={() =>
                      setSelectedCrop({
                        ...crop,
                        parentData: item,
                      })
                    }
                  >
                    <h4 className="text-lg font-bold text-green-700">
                      {crop.name} (Priority {crop.priority})
                    </h4>
                    {crop.imageUrl && (
                      <img
                        src={crop.imageUrl}
                        alt={crop.name}
                        className="w-full h-40 object-cover rounded-lg mt-2"
                      />
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}

          <button
            onClick={() => {
              setStep(0);
              setPredictionResult(null);
              setFormData({
                soilPh: "",
                waterAvailability: "",
                season: "",
                soilType: "",
                growingPeriod: "",
              });
            }}
            className="mt-6 px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* ⭐⭐⭐ MODAL FOR CROP DETAILS ⭐⭐⭐ */}
      <AnimatePresence>
        {selectedCrop && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto relative"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCrop(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-xl font-bold"
              >
                ✕
              </button>

              <h3 className="text-xl font-bold text-green-700 mb-3 mt-6">
                {selectedCrop.name}
              </h3>

              {selectedCrop.imageUrl && (
                <img
                  src={selectedCrop.imageUrl}
                  alt={selectedCrop.name}
                  className="rounded-xl w-full h-48 object-cover mb-3"
                />
              )}

              <div className="text-left space-y-2 mb-4">
                <p><strong>Priority:</strong> {selectedCrop.priority}</p>
              </div>

              <div className="text-left space-y-2 border-t pt-3">
                <p><strong>Description:</strong> {selectedCrop.parentData.description}</p>
                <p><strong>Fertilizers:</strong> {selectedCrop.parentData.fertilizers}</p>

                <p><strong>Soil pH:</strong> {selectedCrop.parentData.soilPh}</p>
                <p><strong>Water Availability:</strong> {selectedCrop.parentData.waterAvailability}</p>
                <p><strong>Season:</strong> {selectedCrop.parentData.season}</p>
                <p><strong>Soil Type:</strong> {selectedCrop.parentData.soilType}</p>
                <p><strong>Growing Period:</strong> {selectedCrop.parentData.growingPeriod}</p>
              </div>

              <button
                onClick={() => setSelectedCrop(null)}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CropPredictionForm;
