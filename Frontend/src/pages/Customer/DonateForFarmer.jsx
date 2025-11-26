// File: src/pages/Donate.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const Donate = () => {
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.id = "razorpay-script";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!amount || !donorName) {
      toast.error("Please enter your name and donation amount!");
      return;
    }

    setLoading(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Razorpay SDK failed to load!");
        setLoading(false);
        return;
      }

      const options = {
        key: "rzp_live_RVbfAldulSv7qd", // Razorpay Key ID
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "Support Farmers",
        description: "Donation Payment",
        prefill: { name: donorName },
        theme: { color: "#16a34a" },
        handler: function (response) {
          // Payment success
          setPaymentSuccess(true);
          setAmount("");
          setDonorName("");
        },
        modal: {
          ondismiss: function () {
            toast.error("Donation cancelled!");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Could not initiate payment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-screen bg-green-50 text-green-800 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          🎉 Thank You!
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl text-center max-w-xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Your donation has been received successfully. Your support helps farmers improve
          their livelihoods and adopt sustainable practices. 🌾
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-green-50 to-lime-100 rounded-xl shadow-lg mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-green-800 mb-4">Support Farmers</h1>
      <p className="text-gray-700 mb-6">
        Your contribution helps farmers improve their livelihoods and adopt sustainable practices.
      </p>

      <form onSubmit={handleDonate} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Your Name</label>
          <input
            type="text"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-3 border border-green-300 rounded-md focus:ring focus:ring-green-200 transition-all"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Donation Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-3 border border-green-300 rounded-md focus:ring focus:ring-green-200 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
        >
          {loading ? "Processing..." : "Donate Now"}
        </button>
      </form>
    </motion.div>
  );
};

export default Donate;
