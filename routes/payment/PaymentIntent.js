const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);

module.exports = function (client) {

    router.post("/", async (req, res) => {
    const { price } = req.body;
    const amount = parseInt(price * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });

  return router;
};
