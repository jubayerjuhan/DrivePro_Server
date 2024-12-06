import catchAsyncError from "../middlewares/catchAsyncError.js";
import Errorhandler from "../middlewares/handle_error.js";
import { sendJwtToken } from "../middlewares/sendJwtToken.js";
import { userModel } from "../models/user_model.js";
import { gcloudStorage } from "../index.js";
import { format } from "util";
import { sendEmail } from "./email_controller.js";

export const registerUser = catchAsyncError(async (req, res, next) => {
  if (!req.body) next(new Errorhandler(404, "Email Or Password Not Found"));

  // checking if the user exist
  const userExist = await userModel.findOne({ email: req.body?.email });
  if (userExist) next(new Errorhandler(500, "User Already Exist"));

  const user = await userModel.create(req.body);
  const emailSuccess = await sendEmail(2, user.email, user.firstName, " ");

  sendJwtToken(res, next, user);
});

export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new Errorhandler(400, "Please Fill Out All The Field"));
  const user = await userModel.findOne({ email }).select("+password");

  if (!user)
    return next(new Errorhandler(400, "No User Found With This Email"));

  const validPass = await user.passwordComparison(password);
  if (validPass) return sendJwtToken(res, next, user);

  res.status(403).json({
    success: false,
    message: "You Entered Wrong Credentials",
  });
});

export const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) next(new Errorhandler(404, "No User Found With This Email"));
  await user.resetPasswordRequest();

  user.save();

  res.status(200).json({
    success: true,
    message: "Please Check Your Email, Password Reset Link Sent",
  });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    next(new Errorhandler(404, `Token or Id Not Found`));

  const user = await userModel
    .findOne({ resetPasswordToken: token })
    .select("+resetPasswordToken")
    .select("+resetPasswordTime");

  // matching the token
  if (Date.now() > user.resetPasswordTime) {
    return next(new Errorhandler(500, `Token Time Out`));
  }

  if (token !== user.resetPasswordToken)
    return next(new Errorhandler(403, `Token Is Not Valid`));

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
  });
});

// add credit hours to user
export const addCredit = catchAsyncError(async (req, res, next) => {
  const { hour } = req.body;
  if (!hour) return next(new Errorhandler(401, "Credit Hour Not Specified"));

  const user = await userModel.findById(req.user._id);
  user.credit = req.user.credit + parseInt(hour);
  user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

export const getCurrentUser = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export const editUser = catchAsyncError(async (req, res, next) => {
  const userEdited = await userModel.findByIdAndUpdate(req.user._id, {
    ...req.body,
    email: req.user.email,
  });
  const user = await userModel.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

// update profile pic
export const updateProfilePic = catchAsyncError(async (req, res, next) => {
  const bucket = gcloudStorage.bucket("my_instructor");
  // ===========Image upload handleing===============
  if (!req.file) {
    return;
  }

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(Date.now() + req.file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  // blobStream.on("error", (err) => {
  //   next(err);
  //   res.status(500).json({
  //     success: false,
  //   });
  // });

  blobStream.on("finish", async () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );
    console.log(publicUrl, "public url...");
    const user = await userModel.findById(req.user._id);
    user.avater = publicUrl;
    user.save();

    if (publicUrl)
      // response
      return res.status(200).json({
        success: true,
        user,
      });
  });
  blobStream.end(req.file.buffer);
});

// upload image
export const uploadFilesToServer = catchAsyncError(async (req, res, next) => {
  const bucket = gcloudStorage.bucket("my_instructor");
  // ===========Image upload handleing===============
  if (!req.file) {
    // res.status(400).send("No file uploaded.");
    return;
  }

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(Date.now() + req.file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on("error", (err) => {
    next(err);
    res.status(500).json({
      success: false,
    });
  });

  blobStream.on("finish", async () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );

    // response
    return res.status(200).json({
      success: true,
      file: publicUrl,
    });
  });
  blobStream.end(req.file.buffer);
});
