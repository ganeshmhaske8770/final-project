import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { toast } from "react-hot-toast";

const ViewPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [editingPrediction, setEditingPrediction] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const predictionsPerPage = 5;

  // Fetch predictions
  const fetchPredictions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/cropprediction", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPredictions(res.data);
    } catch (err) {
      toast.error("❌ Error fetching predictions");
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  // Delete prediction
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prediction?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/cropprediction/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Prediction deleted successfully");

      // Adjust page if last item removed
      const totalPages = Math.ceil((predictions.length - 1) / predictionsPerPage);
      if (currentPage > totalPages) {
        setCurrentPage(totalPages || 1);
      }

      fetchPredictions();
    } catch (err) {
      toast.error("❌ Error deleting prediction");
    }
  };

  // Edit prediction
  const handleEdit = (prediction) => {
    setEditingPrediction(prediction);
  };

  // Update prediction
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/cropprediction/${editingPrediction._id}`,
        editingPrediction,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Prediction updated successfully");
      setEditingPrediction(null);
      fetchPredictions();
    } catch (err) {
      toast.error("❌ Error updating prediction");
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * predictionsPerPage;
  const indexOfFirst = indexOfLast - predictionsPerPage;
  const currentPredictions = predictions.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(predictions.length / predictionsPerPage);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Crop Predictions</h2>

      {/* ==========================================
          VIEW TABLE (WHEN NOT EDITING)
      =========================================== */}
      {!editingPrediction ? (
        <>
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200 text-sm md:text-base">
                  <th className="border p-2">Soil pH</th>
                  <th className="border p-2">Water</th>
                  <th className="border p-2">Season</th>
                  <th className="border p-2">Soil Type</th>
                  <th className="border p-2">Growing Period</th>
                  <th className="border p-2">Fertilizers</th>
                  <th className="border p-2">Crops</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentPredictions.map((p) => (
                  <tr key={p._id} className="border text-sm md:text-base">
                    <td className="border p-2">{p.soilPh}</td>
                    <td className="border p-2">{p.waterAvailability}</td>
                    <td className="border p-2">{p.season}</td>
                    <td className="border p-2">{p.soilType}</td>
                    <td className="border p-2">{p.growingPeriod}</td>
                    <td className="border p-2">{p.fertilizers || "—"}</td>

                    <td className="border p-2">
                      {p.recommendedCrops.map((crop, i) => (
                        <div key={i} className="mb-2">
                          <strong>{crop.name}</strong> (Priority {crop.priority})
                          {crop.imageUrl && (
                            <img
                              src={crop.imageUrl}
                              alt={crop.name}
                              className="w-20 h-20 object-cover rounded mt-1"
                            />
                          )}
                        </div>
                      ))}
                    </td>

                    <td className="border p-2 space-x-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ==========================================
              PAGINATION SECTION
          =========================================== */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-4">

            {/* Previous Button */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-3 py-1 rounded border 
                ${currentPage === 1 ? "bg-gray-200 text-gray-500" : "bg-white hover:bg-gray-100"}
              `}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded border 
                  ${currentPage === num ? "bg-green-500 text-white" : "bg-white hover:bg-gray-100"}
                `}
              >
                {num}
              </button>
            ))}

            {/* Next Button */}
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-3 py-1 rounded border 
                ${currentPage === totalPages || totalPages === 0
                  ? "bg-gray-200 text-gray-500"
                  : "bg-white hover:bg-gray-100"}
              `}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        /* ==========================================
           EDIT FORM
        =========================================== */
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-xl font-semibold mb-3">Edit Prediction</h3>

          <form onSubmit={handleUpdate} className="space-y-3">
            {/* Soil pH */}
            <div>
              <label className="block font-medium">Soil pH</label>
              <input
                type="number"
                value={editingPrediction.soilPh}
                onChange={(e) =>
                  setEditingPrediction({ ...editingPrediction, soilPh: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
            </div>

            {/* Water */}
            <div>
              <label className="block font-medium">Water Availability</label>
              <select
                value={editingPrediction.waterAvailability}
                onChange={(e) =>
                  setEditingPrediction({
                    ...editingPrediction,
                    waterAvailability: e.target.value,
                  })
                }
                className="border p-2 w-full rounded"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            {/* Season */}
            <div>
              <label className="block font-medium">Season</label>
              <select
                value={editingPrediction.season}
                onChange={(e) =>
                  setEditingPrediction({
                    ...editingPrediction,
                    season: e.target.value,
                  })
                }
                className="border p-2 w-full rounded"
              >
                <option>Winter</option>
                <option>Monsoon</option>
                <option>Summer</option>
              </select>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block font-medium">Soil Type</label>
              <select
                value={editingPrediction.soilType}
                onChange={(e) =>
                  setEditingPrediction({
                    ...editingPrediction,
                    soilType: e.target.value,
                  })
                }
                className="border p-2 w-full rounded"
              >
                <option>Sandy</option>
                <option>Loamy</option>
                <option>Clay</option>
                <option>Black</option>
                <option>Alluvial</option>
              </select>
            </div>

            {/* Growing Period */}
            <div>
              <label className="block font-medium">Growing Period</label>
              <select
                value={editingPrediction.growingPeriod}
                onChange={(e) =>
                  setEditingPrediction({
                    ...editingPrediction,
                    growingPeriod: e.target.value,
                  })
                }
                className="border p-2 w-full rounded"
              >
                <option>Short</option>
                <option>Medium</option>
                <option>Long</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium">Description</label>
              <textarea
                value={editingPrediction.description || ""}
                onChange={(e) =>
                  setEditingPrediction({
                    ...editingPrediction,
                    description: e.target.value,
                  })
                }
                className="border p-2 w-full rounded"
                rows={3}
              />
            </div>

            {/* Fertilizers */}
            <div>
              <label className="block font-medium">Fertilizers</label>
              <textarea
                value={editingPrediction.fertilizers || ""}
                onChange={(e) =>
                  setEditingPrediction({
                    ...editingPrediction,
                    fertilizers: e.target.value,
                  })
                }
                className="border p-2 w-full rounded"
                rows={3}
              />
            </div>

            {/* Recommended Crops */}
            <div>
              <h4 className="font-medium">Recommended Crops</h4>
              {editingPrediction.recommendedCrops.map((crop, i) => (
                <div key={i} className="mb-2 p-2 border rounded">
                  <input
                    type="text"
                    value={crop.name}
                    onChange={(e) => {
                      const updated = [...editingPrediction.recommendedCrops];
                      updated[i].name = e.target.value;

                      setEditingPrediction({
                        ...editingPrediction,
                        recommendedCrops: updated,
                      });
                    }}
                    className="border p-2 w-full rounded mb-1"
                  />

                  <select
                    value={crop.priority}
                    onChange={(e) => {
                      const updated = [...editingPrediction.recommendedCrops];
                      updated[i].priority = Number(e.target.value);

                      setEditingPrediction({
                        ...editingPrediction,
                        recommendedCrops: updated,
                      });
                    }}
                    className="border p-2 w-full rounded mb-1"
                  >
                    <option value={1}>Best (1)</option>
                    <option value={2}>Alternative (2)</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Image URL"
                    value={crop.imageUrl || ""}
                    onChange={(e) => {
                      const updated = [...editingPrediction.recommendedCrops];
                      updated[i].imageUrl = e.target.value;

                      setEditingPrediction({
                        ...editingPrediction,
                        recommendedCrops: updated,
                      });
                    }}
                    className="border p-2 w-full rounded mb-1"
                  />

                  {crop.imageUrl && (
                    <img
                      src={crop.imageUrl}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded mt-1"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Update Prediction
              </button>

              <button
                type="button"
                onClick={() => setEditingPrediction(null)}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ViewPredictions;
