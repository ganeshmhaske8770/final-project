import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiLoader } from "react-icons/fi";

const FarmerDonation = () => {
  const [form, setForm] = useState({
    bankAccountNo: "",
    IFSCCode: "",
    bankHolderName: "",
    bankName: "",
    branchName: "",
    donationPurpose: "",
    amountNeeded: "",
    note: "",
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  // HANDLE INPUTS
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // IMAGE PREVIEW FIX
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      images.forEach((file) => data.append("images", file));

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.post("http://localhost:5000/api/donation/submit", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Donation request submitted!");

      // RESET
      setForm({
        bankAccountNo: "",
        IFSCCode: "",
        bankHolderName: "",
        bankName: "",
        branchName: "",
        donationPurpose: "",
        amountNeeded: "",
        note: "",
      });
      setImages([]);
      setPreview([]);
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto p-6"
    >
      {/* TITLE */}
      <motion.h2
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-extrabold mb-6 text-center text-green-700"
      >
        🌿 Farmer Donation Request
      </motion.h2>

      {/* FORM */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="bg-white p-8 rounded-2xl shadow-xl border border-green-100 space-y-5"
      >
        {/* INPUT FIELDS */}
        {[
          { label: "Bank Holder Name", name: "bankHolderName", type: "text" },
          { label: "Bank Account Number", name: "bankAccountNo", type: "text" },
          { label: "IFSC Code", name: "IFSCCode", type: "text" },
          { label: "Bank Name", name: "bankName", type: "text" },
          { label: "Branch Name", name: "branchName", type: "text" },
        ].map((input, i) => (
          <motion.div
            key={input.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <label className="font-semibold text-green-700">{input.label}</label>
            <input
              type={input.type}
              name={input.name}
              value={form[input.name]}
              onChange={handleChange}
              className="w-full border-2 border-green-200 p-3 rounded-xl focus:ring-2 focus:ring-green-400 outline-none transition-all"
              required
            />
          </motion.div>
        ))}

        {/* PURPOSE */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <label className="font-semibold text-green-700">Donation Purpose</label>
          <textarea
            name="donationPurpose"
            value={form.donationPurpose}
            onChange={handleChange}
            className="w-full border-2 border-green-200 p-3 rounded-xl h-24 focus:ring-2 focus:ring-green-400 outline-none transition-all"
            required
          />
        </motion.div>

        {/* AMOUNT */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <label className="font-semibold text-green-700">Amount Needed (₹)</label>
          <input
            type="number"
            name="amountNeeded"
            value={form.amountNeeded}
            onChange={handleChange}
            className="w-full border-2 border-green-200 p-3 rounded-xl focus:ring-2 focus:ring-green-400 outline-none transition-all"
            required
          />
        </motion.div>

        {/* NOTE */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <label className="font-semibold text-green-700">Additional Note</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            className="w-full border-2 border-green-200 p-3 rounded-xl h-20 focus:ring-2 focus:ring-green-400 outline-none transition-all"
          />
        </motion.div>

        {/* IMAGE UPLOAD */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <label className="font-semibold text-green-700">Upload Images</label>

          <div className="border-2 border-dashed border-green-300 p-5 rounded-xl text-center hover:bg-green-50 transition-all">
            <label className="cursor-pointer flex flex-col items-center gap-2">
              <FiUploadCloud size={40} className="text-green-600" />
              <p className="text-green-600 font-medium">Click to upload images</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </motion.div>

        {/* IMAGE PREVIEW FIXED */}
        {preview.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-3 max-h-60 overflow-y-auto p-2 border rounded-lg bg-green-50">
            {preview.map((img, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full h-32 bg-gray-200 rounded-xl overflow-hidden shadow"
              >
                <img
                  src={img}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:bg-green-700 transition-all"
        >
          {loading ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex justify-center"
            >
              <FiLoader size={24} />
            </motion.span>
          ) : (
            "Submit Donation Request"
          )}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default FarmerDonation;
