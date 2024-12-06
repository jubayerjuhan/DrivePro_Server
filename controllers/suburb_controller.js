import catchAsyncError from "../middlewares/catchAsyncError.js";
import Errorhandler from "../middlewares/handle_error.js";
import { Suburbs } from "../models/subrubs_model.js";

export const editSuburb = catchAsyncError(async (req, res, next) => {
  const price = req.body.price;
  if (!price) return next(new Errorhandler(404, "Price Not Found"));

  const suburb = await Suburbs.findByIdAndUpdate(req.params.id, {
    price,
  });
  const editedSuburb = await Suburbs.findById(req.params.id);

  res.status(200).json({
    success: true,
    suburb: editedSuburb,
  });
});

export const createSuburb = catchAsyncError(async (req, res, next) => {});
