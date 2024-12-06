import catchAsyncError from "../../middlewares/catchAsyncError.js";
import Errorhandler from "../../middlewares/handle_error.js";
import { Instructor } from "../../models/instructor_model.js";

// get all bookings================
export const getAllInstructors = catchAsyncError(async (req, res, next) => {
  const instructors = await Instructor.find();

  res.status(200).json({
    success: true,
    instructors: instructors.reverse(),
  });
});

// get single booking================
export const getSingleInstructor = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const instructor = await Instructor.findById(id);

  if (!instructor) return next(new Errorhandler(404, "No instructor Found"));

  res.status(200).json({
    success: true,
    instructor,
  });
});

// update booking
export const updateInstructor = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const userEdited = await Instructor.findByIdAndUpdate(id, {
    ...req.body,
  });
  const instructor = await Instructor.findById(id);

  res.status(200).json({
    success: true,
    instructor,
  });
});
// update booking
export const deleteInstructor = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const deletedUser = await Instructor.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
  });
});
