import { Suburbs } from "../models/subrubs_model.js";
import EarningModel from "../models/earnings_model.js";
import { generateInvoice } from "../invoice/generate_invoice/generateInvoice.js";
import moment from "moment";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

import catchAsyncError from "../middlewares/catchAsyncError.js";

export const addEarningsToInstructor = async (instructor, booking, next) => {
  return new Promise(async (resolve, reject) => {
    const suburb = await Suburbs.findById(booking.pickupDetails.suburb);

    const unitPrice = suburb.price;
    const totalLessonPrice = unitPrice * booking.duration;
    let total = 0;
    let subtotal = 0;
    let managementFee = 0;
    let gst = 0;
    let inclusiveGst = 0;

    //  CALCULATING THE SPLITTING PRICES OF THE BOOKING
    inclusiveGst = totalLessonPrice / 11;
    managementFee = totalLessonPrice * 0.2;
    total = totalLessonPrice * 0.8;
    gst = instructor.hasGst ? inclusiveGst * 0.8 : 0;
    subtotal = total - gst;

    // defining invoice information
    const invoiceInfo = {
      customerName: `${instructor.firstName} ${instructor.lastName}`,
      items: [
        {
          description: `#${booking._id} - ${
            booking.type === "Test Package"
              ? "Driving Test Package"
              : "Driving Lesson"
          } - ${booking.user?.firstName}`,
          quantity: booking.duration,
          unitPrice: Number(unitPrice.toFixed(2)),
          amount: Number(totalLessonPrice.toFixed(2)),
          gst: Number(inclusiveGst.toFixed(2)),
        },
      ],
      inclusiveGst: Number(inclusiveGst.toFixed(2)),
      bookingAmount: Number(totalLessonPrice.toFixed(2)),
      customerAbn: instructor?.abnNumber,
      customerAddress: instructor?.invoiceAddress,
      invoiceId: Date.now(),
      date: moment().format("DD MMMM YYYY"),
      managementFee: Number(managementFee.toFixed(2)),
      subtotal: Number(subtotal.toFixed(2)),
      gst: Number(gst.toFixed(2)),
      total: Number(total.toFixed(2)),
    };

    const ejsPath = path.join(__dirname, "../invoice/ejs/invoice.ejs");
    const invoice = await generateInvoice(invoiceInfo, ejsPath);

    EarningModel.create({
      bookingType: booking.type ? "Driving Lesson" : "Driving Test Package",
      bookingId: booking._id,
      learner: booking.user._id,
      instructor: instructor._id,
      duration: booking.duration,
      bookingAmount: Number(totalLessonPrice.toFixed(2)),
      unitPrice: Number(unitPrice.toFixed(2)),
      total: Number(total.toFixed(2)),
      managementFee: Number(managementFee.toFixed(2)),
      gst: Number(gst.toFixed(2)),
      inclusiveGst: Number(inclusiveGst.toFixed(2)),
      subtotal: Number(subtotal.toFixed(2)),
      invoice: invoice,
    })
      .then((res) => {
        return resolve(invoice);
      })
      .catch((err) => reject(err));
  });
};

export const getEarningsByInstructor = catchAsyncError(
  async (req, res, next) => {
    console.log(req.user._id, "user id");
    // finding earnings by params
    const earnings = await EarningModel.find({
      instructor: req.user._id,
    })
      .populate("learner", "firstName lastName")
      .sort({ createdAt: -1 });

    console.log(earnings);
    res.status(200).json({
      success: true,
      earnings: earnings,
    });
  }
);

// get total pending earnings for user
export const getInstructorPendingEarning = catchAsyncError(
  async (req, res, next) => {
    const instructorId = req.user._id;

    const instructorEarnings = await EarningModel.aggregate([
      {
        $match: {
          instructor: instructorId,
          paid: false,
        },
      },
      {
        $group: {
          _id: null,
          totalUnpaidAmount: { $sum: "$subtotal" },
        },
      },
      {
        $project: {
          _id: 0,
          totalUnpaidAmount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      amount: instructorEarnings[0]?.totalUnpaidAmount || 0,
    });
  }
);
