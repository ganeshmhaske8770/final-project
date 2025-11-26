import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  FiUser,
  FiPlusCircle,
  FiPackage,
  FiTrendingUp,
  FiMap,
  FiBell,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiBarChart2,
  FiHeart
} from "react-icons/fi";

const FarmerLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [openDonationMenu, setOpenDonationMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "Fprofile", icon: <FiUser />, label: "Profile" },
    { path: "add-product", icon: <FiPlusCircle />, label: "Add Product" },
    { path: "my-products", icon: <FiPackage />, label: "My Products" },
    { path: "crop-predictions", icon: <FiBarChart2 />, label: "Crop Predictions" },
    { path: "stats", icon: <FiTrendingUp />, label: "Insights" },
    { path: "roadmap", icon: <FiMap />, label: "Roadmap" },
    { path: "notification", icon: <FiBell />, label: "Notification" },
    { path: "donation", icon: <FiHeart />, label: "Donation", isParent: true }
  ];

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-r from-green-100 to-lime-200 min-h-screen">

      {/* ========= Desktop Sidebar ========= */}
      <motion.div
        animate={{ width: isOpen ? 256 : 80 }}
        className="hidden md:flex relative bg-gradient-to-r from-green-500 via-lime-500 to-yellow-300 text-white min-h-screen flex-col justify-between"
        transition={{ duration: 0.3 }}
      >
        <div>
          <div className="p-4 text-xl font-bold">
            {isOpen ? "Farmer Dashboard" : "FD"}
          </div>

          <ul className="space-y-2 px-2">
            {menuItems.map((item, idx) => {
              const isActive = activeItem.includes(item.path);

              if (item.isParent) {
                return (
                  <div key={idx}>
                    <motion.li whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <button
                        onClick={() => setOpenDonationMenu(!openDonationMenu)}
                        className={`group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-full border transition-all duration-300 shadow-sm w-full
                          ${openDonationMenu
                              ? "bg-orange-400 text-white border-green-700"
                              : "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-200"}`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          {isOpen && <span>{item.label}</span>}
                        </div>
                        {isOpen && (openDonationMenu ? <FiChevronUp /> : <FiChevronDown />)}
                      </button>
                    </motion.li>

                    <AnimatePresence>
                      {openDonationMenu && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-8 mt-2 space-y-2"
                        >
                          <li>
                            <Link
                              to="request-donation"
                              onClick={() => setActiveItem("request-donation")}
                              className={`block px-3 py-1.5 rounded-lg text-sm
                                ${activeItem.includes("request-donation")
                                  ? "bg-orange-300 text-white"
                                  : "bg-white text-green-900"}`}
                            >
                              Request Donation
                            </Link>
                          </li>

                          <li>
                            <Link
                              to="donation-status"
                              onClick={() => setActiveItem("donation-status")}
                              className={`block px-3 py-1.5 rounded-lg text-sm
                                ${activeItem.includes("donation-status")
                                  ? "bg-orange-300 text-white"
                                  : "bg-white text-green-900"}`}
                            >
                              Donation Status
                            </Link>
                          </li>
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <motion.li key={idx} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to={item.path}
                    onClick={() => setActiveItem(item.path)}
                    className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-full border shadow-sm transition-all
                      ${isActive
                        ? "bg-orange-400 text-white border-green-700"
                        : "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-200"}`}
                  >
                    {item.icon}
                    {isOpen && <span>{item.label}</span>}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>

        <div className="p-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 bg-red-500 text-white font-semibold rounded-lg"
          >
            <FiLogOut />
            {isOpen && "Logout"}
          </motion.button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-full shadow-lg"
        >
          {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </motion.div>

      {/* ========= Mobile Dropdown Menu (NEW LIKE CUSTOMER LAYOUT) ========= */}
      <div className="md:hidden w-full bg-gradient-to-b from-green-500 via-lime-500 to-yellow-400 text-white shadow-lg">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 font-bold text-lg"
        >
          Menu
          {isMobileOpen ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-2 p-3"
            >
              {menuItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  {!item.isParent ? (
                    <Link
                      to={item.path}
                      onClick={() => {
                        setActiveItem(item.path);
                        setIsMobileOpen(false);
                      }}
                      className={`flex flex-col items-center justify-center rounded-lg py-3 font-semibold shadow-md transition-all
                        ${activeItem.includes(item.path)
                          ? "bg-green-500 text-white"
                          : "bg-white/90 text-green-700 hover:bg-white"}`}
                    >
                      <span className="text-2xl mb-1">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  ) : (
                    <>
                      {/* Donation Parent Button */}
                      <button
                        onClick={() => setOpenDonationMenu(!openDonationMenu)}
                        className="flex flex-col items-center justify-center rounded-lg py-3 bg-white/90 text-green-700 shadow-md"
                      >
                        <span className="text-2xl mb-1">{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                        {openDonationMenu ? <FiChevronUp /> : <FiChevronDown />}
                      </button>

                      <AnimatePresence>
                        {openDonationMenu && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="col-span-2 space-y-2"
                          >
                            <Link
                              to="request-donation"
                              onClick={() => {
                                setActiveItem("request-donation");
                                setIsMobileOpen(false);
                              }}
                              className="block bg-white text-green-700 rounded-lg px-3 py-2 text-center shadow"
                            >
                              Request Donation
                            </Link>

                            <Link
                              to="donation-status"
                              onClick={() => {
                                setActiveItem("donation-status");
                                setIsMobileOpen(false);
                              }}
                              className="block bg-white text-green-700 rounded-lg px-3 py-2 text-center shadow"
                            >
                              Donation Status
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </React.Fragment>
              ))}

              {/* Logout */}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileOpen(false);
                }}
                className="flex flex-col items-center justify-center bg-red-500 text-white font-semibold rounded-lg py-3 shadow-md"
              >
                <FiLogOut className="text-2xl mb-1" />
                <span className="text-sm">Logout</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========= Main Content ========= */}
      <motion.div
        className="flex-1 p-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default FarmerLayout;
