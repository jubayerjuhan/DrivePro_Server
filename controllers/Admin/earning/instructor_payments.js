import Errorhandler from "../../../middlewares/handle_error.js";
import EarningModel from "../../../models/earnings_model.js";

/**
 * Returns the pending payments of the specified instructor, including earnings breakdown by payment category.
 * @async
 * @function
 * @param {string} instructorId - The ID of the instructor whose pending payments should be retrieved.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<Object>} A Promise that resolves to an object containing an array of earnings objects and a breakdown object with booking amount, total, subtotal, management fee, and GST.
 * @throws {Error} Throws an error if there was an error retrieving the earnings from the database.
 */

export const getInstructorPendingPaymentsById = async (instructorId, next) => {
  return new Promise(async (resolve, reject) => {
    try {
      const earnings = await EarningModel.find({
        instructor: instructorId,
        paid: false,
      }).populate("learner", "firstName lastName");

      if (earnings.length <= 0)
        return reject("No earnings found for this instructor");

      const subtotal = parseFloat(
        earnings.reduce((acc, earning) => acc + earning.subtotal, 0).toFixed(2)
      );

      const bookingAmount = parseFloat(
        earnings
          .reduce((acc, earning) => acc + earning.bookingAmount, 0)
          .toFixed(2)
      );

      const total = parseFloat(
        earnings.reduce((acc, earning) => acc + earning.total, 0).toFixed(2)
      );

      const gst = parseFloat(
        earnings.reduce((acc, earning) => acc + earning.gst, 0).toFixed(2)
      );

      const inclusiveGst = parseFloat(
        earnings
          .reduce((acc, earning) => acc + earning.inclusiveGst, 0)
          .toFixed(2)
      );

      const managementFee = parseFloat(
        earnings
          .reduce((acc, earning) => acc + earning.managementFee, 0)
          .toFixed(2)
      );
      resolve({
        earnings,
        breakdown: {
          bookingAmount,
          total,
          subtotal,
          managementFee,
          gst,
          inclusiveGst,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};
