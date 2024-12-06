import { Router } from "express";
import {
  deleteBooking,
  getAllBookings,
  getSingleBooking,
  updateBooking,
} from "../controllers/Admin/admin_bookings.js";
import {
  addCar,
  deleteCar,
  getAllCars,
  getSinglecar,
  updateCar,
} from "../controllers/Admin/admin_cars.js";
import {
  createAdmin,
  loginAdmin,
} from "../controllers/Admin/admin_controller.js";
import {
  deleteInstructor,
  getAllInstructors,
  getSingleInstructor,
  updateInstructor,
} from "../controllers/Admin/admin_instructor.js";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
} from "../controllers/Admin/admin_user.js";
import { getAppliedInstructors } from "../controllers/instructor_applicant_controller.js";
import {
  addInstructor,
  getExpiredInstructor,
} from "../controllers/instructor_controller.js";
import { setLessonPrice } from "../controllers/payment_controller.js";
import { editSuburb } from "../controllers/suburb_controller.js";
import { verifyAdmin } from "../middlewares/verify_user.js";
import { multerProcess } from "../utils/multer.js";

const router = Router();

router.route("/register").post(createAdmin);
router.route("/login").post(loginAdmin);
router.route("/all-users").get(verifyAdmin, getAllUsers);
router.route("/all-instructors").get(verifyAdmin, getAllInstructors);
router.route("/all-bookings").get(verifyAdmin, getAllBookings);
router.route("/all-cars").get(getAllCars);
router.route("/applied-instructors").get(verifyAdmin, getAppliedInstructors);
router.route("/expired-instructors").get(getExpiredInstructor);
router.route("/set-price").post(setLessonPrice);
router.route("/edit-suburb/:id").put(editSuburb);
router
  .route("/add-car")
  .post(verifyAdmin, multerProcess.single("avater"), addCar);
router
  .route("/add-instructor")
  .post(verifyAdmin, multerProcess.single("avater"), addInstructor);
router
  .route("/user/:id")
  .get(verifyAdmin, getSingleUser)
  .put(verifyAdmin, updateUser)
  .delete(verifyAdmin, deleteUser);
router
  .route("/instructor/:id")
  .get(verifyAdmin, getSingleInstructor)
  .put(verifyAdmin, updateInstructor)
  .delete(verifyAdmin, deleteInstructor);
router
  .route("/booking/:id")
  .get(verifyAdmin, getSingleBooking)
  .put(verifyAdmin, updateBooking)
  .delete(verifyAdmin, deleteBooking);
router
  .route("/car/:id")
  .get(verifyAdmin, getSinglecar)
  .put(verifyAdmin, updateCar)
  .delete(verifyAdmin, deleteCar);
export default router;
