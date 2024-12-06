import moment from "moment";
import catchAsyncError from "../../../middlewares/catchAsyncError.js";
import { FortnightlyPaymentModel } from "../../../models/fortnightly_payment_model.js";

/**
 * Add a new fortnightly payment to the database for the specified instructor and invoice.
 * @param {string} invoice - The ID of the invoice associated with this payment.
 * @param {string} instructorId - The ID of the instructor who is receiving this payment.
 * @param {Object} breakdown - An object containing the breakdown of this payment, including the booking amount,
 * total amount, subtotal amount, management fee, GST, and inclusive GST.
 * @returns {Promise<FortnightlyPayment>} - A Promise that resolves with the newly created FortnightlyPayment document.
 * @throws {Error} - If there is an error creating the FortnightlyPayment document.
 */

export const addFortnightlyPayment = async (
  invoice,
  instructorId,
  breakdown
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // adding new fortnightly payment document to DB
      const fortnightPayment = await FortnightlyPaymentModel.create({
        ...breakdown,
        invoice,
        instructor: instructorId,
      });
      resolve(fortnightPayment);
    } catch (error) {
      reject(error.message);
    }
  });
};

// Admin - Get all fortnightly payments document available on Database with this function For - Admin
export const AdminGetAllFortnightlyPayments = catchAsyncError(
  async (req, res, next) => {
    // getting all fortnightly payments from Db
    const fortnightlyPayments = await FortnightlyPaymentModel.find()
      .sort({
        createdAt: -1,
      })
      .populate("instructor");

    res.status(200).json({
      success: true,
      fortnightlyPayments,
    });
  }
);

/**
 * Instructor - Get all fortnightly payments document available
 * for instructor who requested
 * */

export const instructorAllFortnightlyPayments = catchAsyncError(
  async (req, res, next) => {
    /**
     getting all fortnightly payments from Db which match 
     user id who requested with the instructor id of fortnightly payment in DB
     */
    const fortnightlyPayments = await FortnightlyPaymentModel.find({
      instructor: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      fortnightlyPayments,
    });
  }
);

export const getFinancialReports = catchAsyncError(async (req, res, next) => {
  const { from, to } = req.body;

  const fortnightlyPayments = await FortnightlyPaymentModel.find(
    from && to
      ? {
          $and: [
            {
              createdAt: { $gte: moment(from).startOf("day").toLocaleString() },
            },
            { createdAt: { $lte: moment(to).endOf("day").toLocaleString() } },
            { instructor: req.user._id },
          ],
        }
      : {
          $and: [{ instructor: req.user._id }],
        }
  );

  const totalAmount = fortnightlyPayments.reduce((acc, curr) => {
    return acc + curr.subtotal;
  }, 0);

  res.status(200).json({
    success: true,
    fortnightlyPayments: { reports: fortnightlyPayments, totalAmount },
  });
});
