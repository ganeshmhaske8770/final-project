const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

const router = express.Router();

// ✅ Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================================
// 1️⃣ CREATE ORDER (API endpoint)
// ================================
router.post("/create-order", async (req, res) => {
  try {
    const { customerId, items, address } = req.body;

    // calculate total amount from items
    const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const shipping = total * 0.10;
    const gst = total * 0.08;
    const finalTotal = total + shipping + gst;

    // create Razorpay order
    const options = {
      amount: Math.round(finalTotal * 100), // convert to paise
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);

    // save order in DB with status 'Pending'
    const dbOrder = await Order.create({
      customerId,
      items,
      total: finalTotal,
      address,
      status: "Pending",
    });

    res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      dbOrderId: dbOrder._id,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// ====================================
// 2️⃣ VERIFY PAYMENT (signature check)
// ====================================
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      // Update order status
      await Order.findByIdAndUpdate(dbOrderId, {
        status: "Processing",
        statusUpdatedAt: new Date(),
      });

      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, error: "Invalid signature" });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ success: false, error: "Payment verification failed" });
  }
});

module.exports = router;
