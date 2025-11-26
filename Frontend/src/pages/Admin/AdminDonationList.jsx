import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const AdminDonationList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [filter, setFilter] = useState("all");

  // Fetch donations
  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/donation", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDonations(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // Update status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/donation/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(
        status === "approved"
          ? "Donation approved"
          : "Donation rejected & fund reset"
      );
      fetchDonations();
    } catch (err) {
      console.log(err);
      toast.error("Failed to update status");
    }
  };

  // Mark fund distributed
  const markFundDistributed = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/donation/fund-distribute/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Fund marked as distributed");
      fetchDonations();
    } catch (err) {
      console.log(err);
      toast.error("Failed to mark fund distributed");
    }
  };

  // Filter donations
  const filteredDonations =
    filter === "all"
      ? donations
      : donations.filter((d) => d.status === filter);

  // Animations
  const rowVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  const modalBackdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalContent = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
  };

  const statusVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 150 } },
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">
        All Donation Requests
      </h2>

      {/* Filter Buttons */}
      <div className="flex justify-center mb-4 gap-2 flex-wrap">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <motion.button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded text-sm sm:text-base transition-colors font-medium ${
              filter === status
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </motion.button>
        ))}
      </div>

      {loading ? (
        <p className="text-center">Loading donations...</p>
      ) : filteredDonations.length === 0 ? (
        <p className="text-center text-gray-500">No donations found</p>
      ) : (
        <motion.div layout className="overflow-x-auto">
          <table className="min-w-[700px] w-full bg-white rounded-lg shadow-md">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Farmer</th>
                <th className="py-2 px-4 text-left">Purpose</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredDonations.map((donation) => (
                  <motion.tr
                    key={donation._id}
                    layout
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="border-b hover:bg-green-50 cursor-pointer"
                    onClick={() => setSelectedDonation(donation)}
                  >
                    <td className="py-2 px-4">{donation.farmerId?.name || "Unknown"}</td>
                    <td className="py-2 px-4">{donation.donationPurpose}</td>
                    <td className="py-2 px-4">₹{donation.amountRequired}</td>
                    <td className="py-2 px-4 capitalize">
                      <motion.span
                        key={donation.status}
                        variants={statusVariants}
                        initial="initial"
                        animate="animate"
                      >
                        {donation.status}
                      </motion.span>
                    </td>
                    <td className="py-2 px-4 flex flex-col sm:flex-row gap-2">
                      <motion.button
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(donation._id, "approved");
                        }}
                        disabled={donation.status === "approved"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Accept
                      </motion.button>

                      <motion.button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(donation._id, "rejected");
                        }}
                        disabled={donation.status === "rejected"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Reject
                      </motion.button>

                      {donation.status === "approved" && !donation.fundDistributed && (
                        <motion.button
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            markFundDistributed(donation._id);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Fund Distributed
                        </motion.button>
                      )}

                      {donation.fundDistributed && (
                        <motion.span
                          className="text-blue-700 font-semibold"
                          key={donation.fundDistributed}
                          variants={statusVariants}
                          initial="initial"
                          animate="animate"
                        >
                          ✔ Distributed
                        </motion.span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedDonation && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-11/12 md:w-2/3 lg:w-1/2 relative shadow-lg max-h-[90vh] overflow-y-auto"
              variants={modalContent}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button
                onClick={() => setSelectedDonation(null)}
                className="absolute top-2 right-2 text-red-600 font-bold text-lg"
              >
                &times;
              </button>

              <h3 className="text-xl font-bold mb-4 text-green-700">
                Donation Details
              </h3>

              <p><strong>Farmer:</strong> {selectedDonation.farmerId?.name}</p>
              <p><strong>Purpose:</strong> {selectedDonation.donationPurpose}</p>
              <p><strong>Amount:</strong> ₹{selectedDonation.amountRequired}</p>
              <p><strong>Bank Holder:</strong> {selectedDonation.bankHolderName}</p>
              <p><strong>Account Number:</strong> {selectedDonation.accountNumber}</p>
              <p><strong>IFSC Code:</strong> {selectedDonation.ifscCode}</p>
              <p><strong>Bank Name:</strong> {selectedDonation.bankName}</p>
              <p><strong>Branch Name:</strong> {selectedDonation.branchName}</p>

              {selectedDonation.note && <p><strong>Note:</strong> {selectedDonation.note}</p>}

              {selectedDonation.images?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedDonation.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="donation"
                      className="w-24 h-24 object-cover rounded border"
                    />
                  ))}
                </div>
              )}

              {selectedDonation.status === "approved" && !selectedDonation.fundDistributed && (
                <motion.button
                  onClick={() => {
                    markFundDistributed(selectedDonation._id);
                    setSelectedDonation(null);
                  }}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Mark Fund Distributed
                </motion.button>
              )}

              {selectedDonation.fundDistributed && (
                <motion.p
                  className="mt-4 text-blue-700 font-bold"
                  key={selectedDonation.fundDistributed}
                  variants={statusVariants}
                  initial="initial"
                  animate="animate"
                >
                  ✔ Fund Already Distributed
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDonationList;
