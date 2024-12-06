import catchAsyncError from "../middlewares/catchAsyncError.js";
import { InstructorApplicantModel } from "../models/instructor_applicant_model.js";

export const applyInstructor = catchAsyncError(async (req, res, next) => {
  const applicant = await InstructorApplicantModel.create(req.body);
  if (!applicant)
    next(new Errorhandler(500, `Sorry Request Can't Be Processed This Time`));

  res.status(200).json({
    success: true,
    applicant,
  });
});

export const getAppliedInstructors = catchAsyncError(async (req, res, next) => {
  const applicants = await InstructorApplicantModel.find();

  res.status(200).json({
    success: true,
    applicants,
  });
});

export const getApplicationInformation = catchAsyncError(
  async (req, res, next) => {
    const applicant = await InstructorApplicantModel.findById(req.params.id);
    res.status(200).json({
      success: true,
      applicant,
    });
  }
);

export const removeApplication = catchAsyncError(async (req, res, next) => {
  const applicant = await InstructorApplicantModel.findByIdAndDelete(
    req.params.id
  );
  res.status(200).json({
    success: true,
  });
});
