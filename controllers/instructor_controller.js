import catchAsyncError from "../middlewares/catchAsyncError.js";
import Errorhandler from "../middlewares/handle_error.js";
import { sendJwtToken } from "../middlewares/sendJwtToken.js";
import { Instructor } from "../models/instructor_model.js";
import { Suburbs } from "../models/subrubs_model.js";
import { gcloudStorage } from "../index.js";
import { format } from "util";
import { Booking } from "../models/booking_model.js";
import { sendEmail } from "./email_controller.js";
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: "dh5uejkqb",
  api_key: "749534475976587",
  api_secret: "Fr-gC_dwK6Gebh8JBNygAPqBkzc",
});

const uploadToCloudinary = (req) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "my_instryctor" }, // optional: specify a folder in your Cloudinary account
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    // Write the buffer to the upload stream
    uploadStream.write(req.file.buffer);
    uploadStream.end();
  });
};
export const addInstructor = catchAsyncError(async (req, res, next) => {

  console.log(req.file, "req.body....")
  // const bucket = gcloudStorage.bucket("my_instructor");

  const car = JSON.parse(req.body.car);
  const allSubs = JSON.parse(req.body.serviceSuburbs);
  const languages = JSON.parse(req.body?.languages);

  const file = req.file;
  const fileName = `${Date.now()}-${file.originalname}`;

  // Convert buffer to Base64
  const base64File = file.buffer.toString("base64");
  const dataURI = `data:${file.mimetype};base64,${base64File}`;


  // Upload to Cloudinary
  const result = await new Promise(
    (resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          resource_type: "image",
          public_id: fileName,
          tags: ["image", "avatar"],
          content_type: file.mimetype,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    }
  );

  console.log(result, "result....")

  // Get the URL of the uploaded image
  const imageUrl = result.secure_url;

  const userExist = await Instructor.findOne({ email: req.body?.email });
  if (userExist)
    return next(
      new Errorhandler(500, "Instructor Already Exist With This Email")
    );

  try {
    const instructor = await Instructor.create({
      ...req.body,
      // avater: publicUrl,
      car,
      languages,
      serviceSuburbs: {
        suburbs: allSubs.suburbs,
      },
    });

    // sending email after creating the account
    const sms = `email : ${instructor.email}
     \n \n
    password: ${req.body.password}`;
    sendEmail(3, instructor.email, instructor.firstName, sms);

    res.status(200).json({
      success: true,
      instructor,
    });
  } catch (error) {
    console.log(error);
    return next(new Errorhandler(404, "All Information Not Provided"));
  }
});
// blobStream.end(req.file.buffer);
// });

export const loginInstructor = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) next(new Errorhandler(404, `Credentials Not Found`));

  const instructor = await Instructor.findOne({ email }).select("+password");
  if (!instructor)
    return next(new Errorhandler(404, `No Instructor Found With This Email`));

  const passwordValid = await instructor.passwordComparison(password);
  if (passwordValid) return sendJwtToken(res, next, instructor);

  res.status(500).json({
    success: false,
    message: "You Entered Wrong Credentials",
  });
});

// get single instructor
export const singleInstructor = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const instructor = await Instructor.findById(id).populate();
  // "reviews reviews.user"
  // ();

  if (!instructor)
    next(new Errorhandler(404, `No Instructor Found With This Id`));

  res.status(200).json({
    success: true,
    instructor,
  });
});

// get instructor based on suburbs
export const searchInstructor = catchAsyncError(async (req, res, next) => {
  const { postCode, transmission } = req.params;
  const { language } = req.query;

  if (!postCode)
    return next(new Errorhandler(404, `No suburb Postcode Found `));

  if (language && language !== "all") {
    const instructors = await Instructor.find({
      "serviceSuburbs.suburbs": { $elemMatch: { postCode } },
      transmissionType: { $regex: transmission, $options: "i" },
    });

    const sortedInstructor = [];
    instructors.forEach((instructor) => {
      if (instructor.languages.includes(language)) {
        sortedInstructor.push(instructor);
      }
    });

    return res.status(200).json({
      success: true,
      instructors: sortedInstructor,
    });
  }

  const instructors = await Instructor.find({
    "serviceSuburbs.suburbs": { $elemMatch: { postCode } },
    transmissionType: { $regex: transmission, $options: "i" },
  });

  instructors.sort((a, b) => {
    const avgRatingA = a.reviews.reduce((acc, review) => acc + review.rating, 0) / a.reviews.length || 0;
    const avgRatingB = b.reviews.reduce((acc, review) => acc + review.rating, 0) / b.reviews.length || 0;
    return avgRatingB - avgRatingA;
  });


  res.status(200).json({
    success: true,
    instructors,
  });
});

// get all suburbs
export const getAllsuburbs = catchAsyncError(async (req, res, next) => {
  const suburbs = await Suburbs.find({}).select("suburb state postcode price");
  res.status(200).json({
    success: true,
    suburbs,
  });
});

export const searchsuburbs = catchAsyncError(async (req, res, next) => {
  const { keyword } = req.params;
  const suburbsKeyword = await Suburbs.find({
    suburb: { $regex: keyword, $options: "i" },
  }).select("suburb state postcode price");

  const suburbPostcode = await Suburbs.find({
    postcode: parseInt(keyword),
  }).select("suburb state postcode price");

  let suburbs = [];
  suburbs = [...suburbsKeyword, ...suburbPostcode];

  res.status(200).json({
    success: true,
    suburbs,
  });
});

export const forgotInstructorPassword = catchAsyncError(
  async (req, res, next) => {
    const { email } = req.body;

    const instructor = await Instructor.findOne({ email });
    if (!instructor)
      return next(new Errorhandler(404, "No Instructor Found With This Email"));
    await instructor.resetPasswordRequest();

    instructor.save();

    res.status(200).json({
      success: true,
      message: "Please Check Your Email, Password Reset Link Sent",
    });
  }
);

export const resetPasswordInstructor = catchAsyncError(
  async (req, res, next) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return next(new Errorhandler(404, `Token or Id Not Found`));

    const instructor = await Instructor.findOne({ resetPasswordToken: token })
      .select("+resetPasswordToken")
      .select("+resetPasswordTime");
    // matching the token
    if (Date.now() > instructor.resetPasswordTime) {
      return next(
        new Errorhandler(
          500,
          `Your Link Already Expired, Please Resend Forget Password Request`
        )
      );
    }

    if (token !== instructor.resetPasswordToken)
      return next(new Errorhandler(403, `Token Is Not Valid`));

    instructor.password = newPassword;
    await instructor.save();

    res.status(200).json({
      success: true,
    });
  }
);

// edit instructor
export const editInstructor = catchAsyncError(async (req, res, next) => {
  const userEdited = await Instructor.findByIdAndUpdate(req.user._id, {
    ...req.body,
    email: req.user.email,
  });

  const instructor = await Instructor.findById(req.user._id);

  res.status(200).json({
    success: true,
    instructor,
  });
});

// edit profile picture of instructor
export const updateInstructorAvater = catchAsyncError(
  async (req, res, next) => {
    const bucket = gcloudStorage.bucket("my_instructor");
    // ===========Image upload handleing===============
    if (!req.file) {
      res.status(400).send("No Image Found");
      return;
    }

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(Date.now() + req.file.originalname);

    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      next(err);
      res.status(500).json({
        success: false,
      });
    });

    blobStream.on("finish", async () => {
      // The public URL can be used to directly access the file via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
      const instructor = await Instructor.findById(req.user._id);
      instructor.avater = publicUrl;
      instructor.save();

      // response
      return res.status(200).json({
        success: true,
        instructor,
      });
    });
    blobStream.end(req.file.buffer);
  }
);

// insert rating
export const postRating = catchAsyncError(async (req, res, next) => {
  const {
    rating,
    review,
    instructor: instructorId,
    booking: bookingId,
  } = req.body;

  const ratingObject = {
    rating,
    message: review,
    user: `${req.user.firstName} ${req.user.lastName}`,
  };

  // setting the reviews in the review section of the instructor schema
  const instructor = await Instructor.findByIdAndUpdate(
    instructorId,
    {
      $push: { reviews: ratingObject },
    },
    { new: true }
  );

  // sending error message if there is no instructor with the id
  if (!instructor)
    return next(new Errorhandler(400, "No Instructor With The Id"));

  //setting the reviewd: true on the booking

  const booking = await Booking.findByIdAndUpdate(bookingId, {
    reviewed: true,
  });

  // sending error message if there is no booking with the id
  if (!instructor)
    return next(new Errorhandler(400, "No Instructor With The Id"));

  res.status(200).json({
    success: true,
    message: "Review Updated Successfully",
    instructor,
    booking,
  });
});

export const changeInstructorAvailability = catchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;
    const { available } = req.body;

    const instructor = await Instructor.findById(id);

    if (!instructor)
      return next(new Errorhandler(404, "No Instructor Found With This Id"));

    instructor.available = available;
    instructor.save();

    res.status(200).json({
      success: true,
      instructor,
    });
  }
);

export const getExpiredInstructor = catchAsyncError(async (req, res, next) => {
  const instructors = await Instructor.find({
    $or: [
      {
        drivingLicenseExpire: { $lte: Date.now() },
      },
      {
        instructorLicenseExpire: { $lte: Date.now() },
      },
      {
        childrenCheckLicenseExpire: { $lte: Date.now() },
      },
    ],
  });
  res.status(200).json({
    success: true,
    instructors,
    date: Date.now(),
  });
});

// Controller function to add a closed event
export const addClosedEvent = catchAsyncError(async (req, res, next) => {
  // Find the instructor by ID
  const instructor = await Instructor.findById(req.user._id);

  // Add the closed event to the instructor's schedule
  instructor.closedEvents.push(req.body);

  // Save the instructor object with the new closed event
  await instructor.save();

  res
    .status(200)
    .json({ success: true, message: "Closed event added successfully" });
});

// Controller function to get all closed events
export const getClosedEvents = catchAsyncError(async (req, res, next) => {
  // Find the instructor by ID
  const instructor = await Instructor.findById(req.user._id);

  // Retrieve the closed events from the instructor's schedule
  const closedEvents = instructor.closedEvents;

  res.status(200).json({ success: true, closedEvents });
});

// Controller function to delete a closed event
export const deleteClosedEvent = catchAsyncError(async (req, res, next) => {
  // Find the instructor by ID
  const instructor = await Instructor.findById(req.user._id);

  // Find the index of the closed event to be deleted
  const eventIndex = instructor.closedEvents.findIndex(
    (event) => event._id.toString() === req.params.eventId
  );

  // Check if the closed event exists
  if (eventIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Closed event not found" });
  }

  // Remove the closed event from the instructor's schedule
  instructor.closedEvents.splice(eventIndex, 1);

  // Save the instructor object with the closed event removed
  await instructor.save();

  res
    .status(200)
    .json({ success: true, message: "Closed event deleted successfully" });
});
