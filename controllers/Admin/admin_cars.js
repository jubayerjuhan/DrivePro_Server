import { gcloudStorage } from "../../index.js";
import catchAsyncError from "../../middlewares/catchAsyncError.js";
import { format } from "util";
import { carModel } from "../../models/carModel.js";
import Errorhandler from "../../middlewares/handle_error.js";

export const addCar = catchAsyncError(async (req, res, next) => {
  const bucket = gcloudStorage.bucket("my_instructor");
  // ===========Image upload handleing===============
  if (!req.file) {
    return;
  }

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(Date.now() + req.file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on("error", (err) => {
    next(err);
    // res.send(404).send(false);
  });

  blobStream.on("finish", async () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );

    const car = await carModel.create({ ...req.body, image: publicUrl });
    if (!car)
      return next(new Errorhandler(402, "Car Can't Be Created Right Now"));
    res.status(200).json({
      success: true,
      car,
    });
  });
  blobStream.end(req.file.buffer);
});

export const getAllCars = catchAsyncError(async (req, res, next) => {
  const cars = await carModel.find();
  res.status(200).json({
    success: true,
    cars,
  });
});

// // get single car================
export const getSinglecar = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const car = await carModel.findById(id);

  if (!car) return next(new Errorhandler(404, "No car Found"));

  res.status(200).json({
    success: true,
    car,
  });
});

// update car
export const updateCar = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const carEdited = await carModel.findByIdAndUpdate(id, {
    ...req.body,
  });
  const car = await carModel.findById(id);

  res.status(200).json({
    success: true,
    car,
  });
});
// update car
export const deleteCar = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const deletedcar = await carModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
  });
});
