const express = require("express");
const dotenv = require("dotenv");
dotenv.config(); // ✅ must come first

const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("../routes/auth");
const productRoutes = require("../routes/product");
const orderRoutes = require("../routes/order");
const statsRoutes = require("../routes/stats");
const reviewRoutes = require("../routes/review");
const userRoutes = require("../routes/userRoutes");
const wishlistRoutes = require("../routes/wishlist");
const notificationRoutes = require("../routes/notification");
const predictionRoutes = require("../routes/cropprediction");
const cartRoutes = require("../routes/cart");
const orderStatusScheduler = require("../routes/orderStatusSheduler");
const paymentRoutes = require("../routes/paymentRoutes");
const donateRoutes = require("../routes/donationRoutes");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cropprediction", predictionRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/donation", donateRoutes);
const path = require("path");

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ✅ Scheduler (if it’s a function, call it)
orderStatusScheduler;

// ✅ Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error(err));
