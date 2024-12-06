import { Router } from "express";
import {
  changeBookingStatus,
  findBooking,
  getInstructorBookings,
  getUserBookings,
  makeBooking,
} from "../controllers/booking_controller.js";
import { verifyInstructor, verifyUser } from "../middlewares/verify_user.js";

const router = Router();

router.route("/add-booking").post(verifyUser, makeBooking);
router.route("/find-booking/:id").get(verifyUser, findBooking);
router
  .route("/booking/change-status/:id")
  .put(verifyInstructor, changeBookingStatus);
router.route("/instructor-bookings").get(getInstructorBookings);
router.route("/bookings").get(verifyUser, getUserBookings);

export default router;
