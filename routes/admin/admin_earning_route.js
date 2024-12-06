import { verifyAdmin } from "../../middlewares/verify_user.js";
import {
  fortnightPaymentInstructorList,
  getAllEarningsListAdmin,
  paySelectedInstructors,
} from "../../controllers/Admin/earning/admin_earnings.js";

import { Router } from "express";
const router = Router();

router.route("/earning/list").get(verifyAdmin, getAllEarningsListAdmin);
router
  .route("/earning/instructor-list")
  .get(verifyAdmin, fortnightPaymentInstructorList);

router
  .route("/earning/pay-selected-instructors")
  .post(verifyAdmin, paySelectedInstructors);

export default router;
