import Stripe from "stripe";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import Errorhandler from "../middlewares/handle_error.js";
import "dotenv/config";
const stripe = Stripe(
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_KEY_LIVE
    : process.env.STRIPE_KEY_TEST
);

let outsidePrice = 70;
let insidePrice = 65;
let testPrice = 199.5;

export const createPaymentIndent = catchAsyncError(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) return next(new Errorhandler(401, "Amount Not Specified"));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "aud",
    payment_method_types: ["card"],
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});

export const getLessonPrices = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    price: {
      outsidePrice,
      insidePrice,
      testPrice,
    },
  });
});

export const setLessonPrice = catchAsyncError(async (req, res, next) => {
  outsidePrice = req.body.outsidePrice;
  insidePrice = req.body.insidePrice;
  testPrice = req.body.testPrice;

  const price = {
    outsidePrice,
    insidePrice,
    testPrice,
  };
  res.status(200).json({
    success: true,
    price,
  });
});
