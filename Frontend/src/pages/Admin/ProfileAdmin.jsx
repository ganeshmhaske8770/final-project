import React, { useState } from "react";
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit3 } from "react-icons/fi";
import { motion } from "framer-motion";

const AdminProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [admin, setAdmin] = useState({
    name: "Admin",
    email: "admin@12345",
    phone: "9876543210",
    role: "Admin",
    joinedAt: "29/09/2025",
  });

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { staggerChildren: 0.15 } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
  };

  return (
    <motion.div 
      className="p-8 bg-gradient-to-r from-green-50 to-lime-100 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-green-200"
        variants={itemVariants}
      >
        {/* Header */}
        <motion.div className="flex items-center gap-4 mb-6" variants={itemVariants}>
          <div className="bg-green-500 text-white p-4 rounded-full text-3xl shadow-md">
            <FiUser />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-800">Admin Profile</h1>
            <p className="text-gray-500">Manage your account information</p>
          </div>
        </motion.div>

        {/* Profile Info */}
        <motion.div className="space-y-4" variants={containerVariants}>
          {/* Name */}
          <ProfileField
            icon={<FiUser className="text-green-600 text-lg" />}
            label="Name"
            value={admin.name}
            name="name"
            editMode={editMode}
            handleChange={handleChange}
          />

          {/* Email */}
          <ProfileField
            icon={<FiMail className="text-green-600 text-lg" />}
            label="Email"
            value={admin.email}
            name="email"
            editMode={false} // email is read-only
          />

          {/* Phone */}
          <ProfileField
            icon={<FiPhone className="text-green-600 text-lg" />}
            label="Phone"
            value={admin.phone}
            name="phone"
            editMode={editMode}
            handleChange={handleChange}
          />

          {/* Role */}
          <ProfileField
            icon={<FiUser className="text-green-600 text-lg" />}
            label="Role"
            value={admin.role}
            editMode={false}
          />

          {/* Joined Date */}
          <ProfileField
            icon={<FiCalendar className="text-green-600 text-lg" />}
            label="Joined"
            value={admin.joinedAt}
            editMode={false}
          />
        </motion.div>

        {/* Buttons */}
        <motion.div className="mt-6 flex justify-end gap-3" variants={itemVariants}>
          {editMode ? (
            <>
              <motion.button
                onClick={() => setEditMode(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                Save Changes
              </motion.button>
              <motion.button
                onClick={() => setEditMode(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-all"
              >
                Cancel
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={() => setEditMode(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            >
              <FiEdit3 />
              Edit Profile
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Reusable profile field
const ProfileField = ({ icon, label, value, name, editMode, handleChange }) => (
  <motion.div
    className="flex items-center gap-3 border-b pb-3"
    variants={{
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
    }}
  >
    {icon}
    {editMode ? (
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleChange}
        className="w-full p-2 border border-green-300 rounded-md focus:ring focus:ring-green-200 transition-all"
      />
    ) : (
      <p className="text-gray-700 font-medium">{value}</p>
    )}
  </motion.div>
);

export default AdminProfile;
