import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiBarChart2,
  FiDatabase,
  FiTrendingUp,
  FiSun,
  FiCloudRain,
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalPredictions: 0,
    activeSeasons: 0,
    avgSoilPh: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Please login first!");

      const [usersRes, predictionRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/cropprediction", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const users = usersRes.data || [];
      const crops = predictionRes.data || [];

      const farmers = users.filter((u) => u.role === "farmer");

      const avgPh =
        crops.length > 0
          ? (
              crops.reduce((acc, curr) => acc + Number(curr.soilPh || 0), 0) /
              crops.length
            ).toFixed(2)
          : 0;

      const uniqueSeasons = [...new Set(crops.map((d) => d.season))];

      setStats({
        totalFarmers: farmers.length,
        totalPredictions: crops.length,
        activeSeasons: uniqueSeasons.length,
        avgSoilPh: avgPh,
      });

      const chart = [
        { month: "Jan", crops: Math.floor(Math.random() * 20) + 5 },
        { month: "Feb", crops: Math.floor(Math.random() * 20) + 5 },
        { month: "Mar", crops: Math.floor(Math.random() * 20) + 5 },
        { month: "Apr", crops: Math.floor(Math.random() * 20) + 5 },
        { month: "May", crops: Math.floor(Math.random() * 20) + 5 },
        { month: "Jun", crops: Math.floor(Math.random() * 20) + 5 },
      ];
      setChartData(chart);
    } catch (err) {
      console.error("Dashboard load error:", err);
      toast.error("Error loading dashboard data.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { staggerChildren: 0.15 } 
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
  };

  const chartVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, delay: 0.3 } },
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-green-50 to-lime-100 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-3xl font-bold text-green-800 mb-6"
        variants={cardVariants}
      >
        🌾 Admin Dashboard
      </motion.h1>

      {/* ===== STAT CARDS ===== */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FiUsers className="text-4xl text-green-600" />}
          label="Total Farmers"
          value={stats.totalFarmers}
          borderColor="border-green-500"
          variants={cardVariants}
        />
        <StatCard
          icon={<FiDatabase className="text-4xl text-lime-600" />}
          label="Crop Predictions"
          value={stats.totalPredictions}
          borderColor="border-lime-500"
          variants={cardVariants}
        />
        <StatCard
          icon={<FiSun className="text-4xl text-yellow-500" />}
          label="Active Seasons"
          value={stats.activeSeasons}
          borderColor="border-yellow-400"
          variants={cardVariants}
        />
        <StatCard
          icon={<FiTrendingUp className="text-4xl text-blue-500" />}
          label="Average Soil pH"
          value={stats.avgSoilPh}
          borderColor="border-blue-400"
          variants={cardVariants}
        />
      </motion.div>

      {/* ===== CHART SECTION ===== */}
      <motion.div 
        className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 mb-8"
        variants={chartVariants}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-green-700">
            Crop Prediction Trend
          </h3>
          <FiBarChart2 className="text-green-600 text-2xl" />
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
            <XAxis dataKey="month" stroke="#065f46" />
            <YAxis stroke="#065f46" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="crops"
              stroke="#16a34a"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ===== INSIGHT CARDS ===== */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard
          icon={<FiCloudRain className="text-3xl text-green-700" />}
          title="Seasonal Insight"
          text="The upcoming Monsoon season is favorable for paddy, maize, and sugarcane. Maintain soil pH between 6.5 - 7.2."
          gradient="from-lime-100 to-green-100"
          variants={cardVariants}
        />
        <InsightCard
          icon={<FiBarChart2 className="text-3xl text-lime-700" />}
          title="Fertilizer Efficiency"
          text="Nitrogen fertilizers show 15% yield increase when applied early. Monitor soil nutrients regularly."
          gradient="from-green-100 to-lime-100"
          variants={cardVariants}
        />
      </motion.div>
    </motion.div>
  );
};

// ===== REUSABLE COMPONENTS =====

const StatCard = ({ icon, label, value, borderColor, variants }) => (
  <motion.div
    variants={variants}
    whileHover={{ scale: 1.05 }}
    className={`bg-white shadow-lg rounded-2xl p-5 flex items-center gap-4 border-l-8 ${borderColor}`}
  >
    {icon}
    <div>
      <p className="text-gray-600 text-sm">{label}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  </motion.div>
);

const InsightCard = ({ icon, title, text, gradient, variants }) => (
  <motion.div
    variants={variants}
    whileHover={{ scale: 1.03 }}
    className={`bg-gradient-to-r ${gradient} shadow-lg rounded-2xl p-6 border border-green-200`}
  >
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <h3 className="text-lg font-semibold text-green-700">{title}</h3>
    </div>
    <p className="text-gray-700">{text}</p>
  </motion.div>
);

export default Dashboard;
