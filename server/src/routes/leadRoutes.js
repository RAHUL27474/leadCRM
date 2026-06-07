import { Router } from "express";
import {
  createLead,
  deleteLead,
  getLeadStats,
  getLeads,
  updateLead
} from "../controllers/leadController.js";
import { validate } from "../middleware/validate.js";
import {
  createLeadSchema,
  updateLeadSchema
} from "../validators/leadValidators.js";

const router = Router();

router.get("/", getLeads);
router.get("/search", getLeads);
router.get("/stats", getLeadStats);
router.post("/", validate(createLeadSchema), createLead);
router.put("/:id", validate(updateLeadSchema), updateLead);
router.patch("/:id", validate(updateLeadSchema), updateLead);
router.delete("/:id", deleteLead);

export default router;
