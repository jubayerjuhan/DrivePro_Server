import catchAsyncError from "../../middlewares/catchAsyncError.js";
import Errorhandler from "../../middlewares/handle_error.js";
import { userModel } from "../../models/user_model.js";

// get all user================
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await userModel.find();

  res.status(200).json({
    success: true,
    users: users.reverse(),
  });
});

// get single user================
export const getSingleUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findById(id);

  if (!user) return next(new Errorhandler(404, "No User Found"));

  res.status(200).json({
    success: true,
    user,
  });
});

// update user
export const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const userEdited = await userModel.findByIdAndUpdate(id, {
    ...req.body,
  });
  const user = await userModel.findById(id);

  res.status(200).json({
    success: true,
    user,
  });
});
// update user
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const deletedUser = await userModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
  });
});
