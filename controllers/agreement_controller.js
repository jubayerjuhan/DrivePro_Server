import catchAsyncError from "../middlewares/catchAsyncError.js";
import { agreementModel } from "../models/agreement_model.js";

export const createAgreement = catchAsyncError(async (req, res, next) => {
  const agreement = await agreementModel.create(req.body);
  res.status(200).json({
    success: true,
    agreement,
  });
});
export const getAgreement = catchAsyncError(async (req, res, next) => {
  const agreement = await agreementModel.findById(process.env.AGREEMENT_ID);
  res.status(200).json({
    success: true,
    agreement,
  });
});
export const editAgreement = catchAsyncError(async (req, res, next) => {
  const agreement = await agreementModel.findByIdAndUpdate(
    process.env.AGREEMENT_ID,
    { agreement: req.body.agreement }
  );
  res.status(200).json({
    success: true,
  });
});
