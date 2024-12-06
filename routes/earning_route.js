import { Router } from "express";
import {
  getEarningsByInstructor,
  getInstructorPendingEarning,
} from "../controllers/earnings_controller.js";
import { verifyAdmin, verifyInstructor } from "../middlewares/verify_user.js";
const router = Router();

router.route("/list").get(verifyInstructor, getEarningsByInstructor);
router.route("/amount").get(verifyInstructor, getInstructorPendingEarning);

// here is the options for admin on the

export default router;
