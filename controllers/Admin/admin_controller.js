import catchAsyncError from "../../middlewares/catchAsyncError.js";
import Errorhandler from "../../middlewares/handle_error.js";
import { sendJwtToken } from "../../middlewares/sendJwtToken.js";
import { adminModal } from "../../models/admin_model.js";
import { userModel } from "../../models/user_model.js";

export const createAdmin = catchAsyncError(async (req, res, next) => {
  const admin = await adminModal.create(req.body);
  sendJwtToken(res, next, admin);
});

// login admin===========================

export const loginAdmin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new Errorhandler(400, "Please Fill Out All The Field"));
  const admin = await adminModal.findOne({ email }).select("+password");

  if (!admin)
    return next(new Errorhandler(400, "No admin Found With This Email"));

  const validPass = await admin.passwordComparison(password);
  if (validPass) return sendJwtToken(res, next, admin);

  res.status(403).json({
    success: false,
    message: "You Entered Wrong Credentials",
  });
});
