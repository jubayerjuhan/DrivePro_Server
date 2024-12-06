import catchAsyncError from "../../middlewares/catchAsyncError.js";
import Errorhandler from "../../middlewares/handle_error.js";
import { Instructor } from "../../models/instructor_model.js";
import { Booking } from "../../models/booking_model.js";

// get all bookings================
export const getAllBookings = catchAsyncError(async (req, res, next) => {
  const bookings = await Booking.find();

  res.status(200).json({
    success: true,
    bookings: bookings.reverse(),
  });
});

// get single booking================
export const getSingleBooking = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const booking = await Booking.findById(id).populate("user instructor");

  if (!booking) return next(new Errorhandler(404, "No booking Found"));

  res.status(200).json({
    success: true,
    booking: booking,
  });
});

// update booking
export const updateBooking = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const userEdited = await Booking.findByIdAndUpdate(id, {
    ...req.body,
  });
  const booking = await Booking.findById(id);

  res.status(200).json({
    success: true,
    booking,
  });
});
// update booking
export const deleteBooking = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const deletedBooking = await Booking.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
  });
});
