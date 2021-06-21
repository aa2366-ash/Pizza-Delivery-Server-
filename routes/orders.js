var express = require("express");
var router = express.Router();
require("dotenv").config();
const Razorpay = require('razorpay')

const instance = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY_ID,
  key_secret: process.env.RAZOR_PAY_KEY_SECRET,
});

router.post("/", (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100 , // amount == Rs 10
      currency: "INR",
      receipt: "receipt#1",
      payment_capture: 0,
      // 1 for automatic capture // 0 for manual capture
    };
    instance.orders.create(options, async function (err, order) {
      if (err) {
        return res.status(500).json({
          message: "Something Went Wrong",
        });
      }
      console.log(order)
      return res.status(200).json(order);
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message ,
    });
  }
});

module.exports = router;