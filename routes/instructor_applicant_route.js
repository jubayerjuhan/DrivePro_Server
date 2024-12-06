import { Router } from "express";
import {
  applyInstructor,
  getApplicationInformation,
  getAppliedInstructors,
  removeApplication,
} from "../controllers/instructor_applicant_controller.js";
import { verifyAdmin } from "../middlewares/verify_user.js";
const router = Router();
import { multerProcess } from "../utils/multer.js";

router.route("/apply-instructor").post(applyInstructor);
router
  .route("/admin/instructor-application/:id")
  .get(verifyAdmin, getApplicationInformation);
router
  .route("/admin/remove-application/:id")
  .delete(verifyAdmin, removeApplication);

export default router;
