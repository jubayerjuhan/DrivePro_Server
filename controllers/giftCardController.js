import catchAsyncError from "../middlewares/catchAsyncError.js";
import { giftCardModel } from "../models/giftcardsModel.js";
import { userModel } from "../models/user_model.js";
import crypto from "crypto";
import Errorhandler from "../middlewares/handle_error.js";
import { sendEmail } from "../controllers/email_controller.js";

export const createGiftcard = catchAsyncError(async (req, res, next) => {
  const code = crypto.randomBytes(3).toString("hex");

  const giftcard = await giftCardModel.create({
    ...req.body,
    code,
    createdAt: Date.now(),
  });
  const user = await userModel.findById(req.body.from);

  const sms = `$${giftcard.amount}. Your Giftcard Code Is: ${giftcard.code}. \n Giftcard Sender: ${user.firstName} ${user.lastName}. Sender Email: ${user.email}`;
  sendEmail(7, req.body?.to, "Learner", sms);
  res.status(200).json({
    success: true,
    giftcard,
  });
});

export const validateCoupon = catchAsyncError(async (req, res, next) => {
  const { code } = req.params;
  const giftcard = await giftCardModel.find({ code });
  if (!giftcard || giftcard.length <= 0)
    return next(new Errorhandler(404, "Giftcard Code Is Not Valid"));
  res.status(200).json({
    success: true,
    giftcard,
  });
});

export const deleteGiftcard = catchAsyncError(async (req, res, next) => {
  const giftcard = await giftCardModel.findByIdAndDelete(req.params?.id);
  res.status(200).json({
    success: true,
  });
});
