import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiLoader, FiImage } from "react-icons/fi";

const FarmerDonationStatus = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonationStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/donation/my-donations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDonations(res.data);
      } catch (error) {
        console.error(error);
        alert("Unable to fetch donation status");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationStatus();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-600 text-white border border-green-700";
      case "rejected":
        return "bg-red-600 text-white border border-red-700";
      default:
        return "bg-yellow-500 text-white border border-yellow-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto p-6"
    >
      <motion.h2
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-extrabold mb-6 text-center text-green-700"
      >
        📊 Donation Request Status
      </motion.h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <FiLoader size={35} className="text-green-600" />
          </motion.div>
        </div>
      ) : donations.length === 0 ? (
        <p className="text-center text-gray-600 font-medium mt-10">
          No donation requests found.
        </p>
      ) : (
        <div className="space-y-6">
          {donations.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-green-200 p-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-green-700">
                  Donation #{index + 1}
                </h3>

                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-md ${getStatusStyle(
                    item.status
                  )}`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>

              {/* Fund Distributed Status */}
              <div className="mt-2">
                {item.fundDistributed ? (
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full shadow">
                    ✔ Fund Distributed
                  </span>
                ) : item.status === "approved" ? (
                  <span className="px-3 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full shadow">
                    Awaiting Fund Distribution
                  </span>
                ) : null}
              </div>

              {/* Donation Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mt-4">
                <p>
                  <strong>Bank Holder:</strong> {item.bankHolderName}
                </p>
                <p>
                  <strong>Account No:</strong> {item.accountNumber}
                </p>
                <p>
                  <strong>IFSC:</strong> {item.ifscCode}
                </p>
                <p>
                  <strong>Bank:</strong> {item.bankName}
                </p>
                <p>
                  <strong>Branch:</strong> {item.branchName}
                </p>
                <p>
                  <strong>Amount Needed:</strong> ₹{item.amountRequired}
                </p>

                <p className="md:col-span-2">
                  <strong>Purpose:</strong> {item.donationPurpose}
                </p>

                {item.note && (
                  <p className="md:col-span-2">
                    <strong>Note:</strong> {item.note}
                  </p>
                )}

                <p className="text-sm text-gray-500 md:col-span-2">
                  <strong>Submitted On:</strong>{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Images (Optional) */}
              {/* 
              {item.images && item.images.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                    <FiImage /> Uploaded Images:
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {item.images.map((img, idx) => (
                      <motion.img
                        key={idx}
                        src={`http://localhost:5000/${img.replace(/\\/g, "/")}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-28 object-cover rounded-xl shadow-md"
                      />
                    ))}
                  </div>
                </div>
              )} 
              */}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FarmerDonationStatus;
