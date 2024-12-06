import { Router } from "express";
import {
  addClosedEvent,
  addInstructor,
  changeInstructorAvailability,
  deleteClosedEvent,
  editInstructor,
  forgotInstructorPassword,
  getAllsuburbs,
  getClosedEvents,
  loginInstructor,
  postRating,
  resetPasswordInstructor,
  searchInstructor,
  searchsuburbs,
  singleInstructor,
  updateInstructorAvater,
} from "../controllers/instructor_controller.js";
import {
  verifyAdmin,
  verifyInstructor,
  verifyUser,
} from "../middlewares/verify_user.js";
import {
  getInstructorAvailabilities,
  setInstructorAvailability,
} from "../controllers/instructor_availability_controller.js";
import multer from "multer";


const router = Router();
const upload = multer({ storage: multer.memoryStorage() });


router
  .route("/add-instructor")
  .post(verifyAdmin, upload.single("avater"), addInstructor);
router.route("/login-instructor").post(loginInstructor);
router.route("/edit-instructor").put(verifyInstructor, editInstructor);
router.route("/instructor/closed-event").post(verifyInstructor, addClosedEvent);
router
  .route("/instructor/closed-event/list")
  .get(verifyInstructor, getClosedEvents);
router
  .route("/instructor/closed-event/:eventId")
  .delete(verifyInstructor, deleteClosedEvent);
router
  .route("/instructor/update-avater")
  .put(
    verifyInstructor,
    updateInstructorAvater
  );
router.route("/instructor/:id").get(singleInstructor);
router
  .route("/search-instructor/:postCode/:transmission")
  .get(searchInstructor);
router.route("/suburbs").get(getAllsuburbs);
router.route("/search-suburbs/:keyword").get(searchsuburbs);
router.route("/forgot-password/instructor").post(forgotInstructorPassword);
router.route("/reset-password/instructor").post(resetPasswordInstructor);
router
  .route("/instructor/change-availability/:id")
  .post(verifyUser, changeInstructorAvailability);

router
  .route("/instructor/:id/set-availability")
  .post(verifyUser, setInstructorAvailability);
router
  .route("/instructor/:id/get-availability")
  .get(verifyUser, getInstructorAvailabilities);

// review
router.route("/instructor/review").post(verifyUser, postRating);

export default router;
