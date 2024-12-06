import { Router } from "express";
import { getAllsuburbs } from "../controllers/instructor_controller.js";
import { editSuburb } from "../controllers/suburb_controller.js";

const router = Router();

// router.route("/edit-suburb/:id").post(editSuburb);
router.route("/suburbs/all").get(getAllsuburbs);

export default router;
