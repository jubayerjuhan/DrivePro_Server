import catchAsyncError from "../../../middlewares/catchAsyncError.js";
import Errorhandler from "../../../middlewares/handle_error.js";
import EarningModel from "../../../models/earnings_model.js";
import { Instructor } from "../../../models/instructor_model.js";
import { generateAndSendFortnightReportPDF } from "./generate_earning_report.js";
import { getInstructorPendingPaymentsById } from "./instructor_payments.js";

export const getAllEarningsListAdmin = catchAsyncError(async (req, res) => {
  const earnings = await EarningModel.find().populate(
    "instructor learner",
    "firstName lastName avater"
  );

  res.status(200).json({
    success: true,
    earnings,
  });
});
export const fortnightPaymentInstructorList = catchAsyncError(
  async (req, res, next) => {
    const instructors = await Instructor.aggregate([
      {
        $lookup: {
          from: "earnings",
          localField: "_id",
          foreignField: "instructor",
          as: "earnings",
        },
      },
      {
        $unwind: "$earnings",
      },

      {
        $match: {
          "earnings.paid": false,
        },
      },
      {
        $group: {
          _id: "$_id",
          firstName: { $first: "$firstName" },
          lastName: { $first: "$lastName" },
          email: { $first: "$email" },
          amount: { $sum: "$earnings.subtotal" },
        },
      },

      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          amount: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      instructors,
    });
  }
);

// * pay selected instructors
export const paySelectedInstructors = catchAsyncError(
  async (req, res, next) => {
    let failed = 0;
    // get instructors array from the request
    const { instructors } = req.body;

    // setting up a error if we don't get instructor array
    if (!instructors)
      return next(new Errorhandler(404, "No Instructors Found To Pay"));

    // loop through all instructors and get their earnings info
    for (let i = 0; i < instructors.length; i++) {
      const instructorId = instructors[i];
      const instructor = await Instructor.findById(instructorId);

      // if there is no instructor with that id then skipping it
      if (!instructor) continue;

      // get all pending payments by the instructor and generating the fortnightly reports
      try {
        const { earnings, breakdown } = await getInstructorPendingPaymentsById(
          instructorId
        );
        // generating fortnightly payment report for instructor -> PDF file
        try {
          await generateAndSendFortnightReportPDF(
            instructor,
            earnings,
            breakdown
          );
          // making every earning of instructor status paid
          await makeAllEarningStatusToPaid(instructor._id);
        } catch (error) {
          console.log(error);
          failed++;
          continue;
        }
      } catch (error) {
        console.log(error);
        failed++;
        continue;
      }
    }
    //sending the response
    res.status(200).json({
      success: true,
      message: `Instructor Payment Fortnightly Report Sent ${
        failed > 0 ? `${failed} Failed` : "Successfully"
      }`,
    });
  }
);

/**
 * this function will make every unpaid earning status of the instructor to paid
 * @param {String} instructorid - this function will take instructorId as param
 * @returns {Promise} its a void function doesn't return anything
 */
const makeAllEarningStatusToPaid = async (instructorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // updating all of the earnings of instructor from {paid: false} to {paid: true}
      await EarningModel.updateMany(
        { instructor: instructorId, paid: false },
        { paid: true }
      );
      resolve(true);
    } catch (error) {
      reject(false);
    }
  });
};
