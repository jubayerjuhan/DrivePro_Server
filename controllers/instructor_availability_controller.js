import catchAsyncError from "../middlewares/catchAsyncError.js";
import Errorhandler from "../middlewares/handle_error.js";
import { Instructor } from "../models/instructor_model.js";

export const setInstructorAvailability = catchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;
    const { slots, removedSlots } = req.body;

    for (let slot of slots) {
      const { day, startTime, endTime } = slot;
      const instructor = await Instructor.findOneAndUpdate(
        { _id: id, "availability.day": day },
        { $addToSet: { "availability.$.slots": { startTime, endTime } } },
        { new: true }
      );
    }

    for (let slot of removedSlots) {
      const { day, startTime, endTime } = slot;
      const instructor = await Instructor.findOneAndUpdate(
        { _id: id, "availability.day": day },
        { $pull: { "availability.$.slots": { startTime, endTime } } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Availability Updated",
    });
  }
);

// controller function to get instructor
export const getInstructorAvailabilities = catchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    // search for instructor with the id we got in req params
    const instructor = await Instructor.findOne({ _id: id }).select(
      "-_id availability"
    );

    // if no instructor found with the id then return error
    if (!instructor)
      return next(new Errorhandler(404, "Instructor Not Found With the Id"));

    // sending response back to server
    res.status(200).json({
      success: true,
      availability: instructor.availability,
    });
  }
);
