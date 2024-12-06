import { Router } from "express";
import {
  createAgreement,
  editAgreement,
  getAgreement,
} from "../controllers/agreement_controller.js";
const router = Router();

router.route("/add-agreement").post(createAgreement);
router.route("/get-agreement").get(getAgreement);
router.route("/edit-agreement").put(editAgreement);
// router.route("/edit-agreemnt").put(editAgreement);

export default router;
