import { z } from "zod";
import { LEAD_STATUSES } from "../models/Lead.js";

const requiredText = (field, max) =>
  z
    .string({
      required_error: `${field} is required`
    })
    .trim()
    .min(1, `${field} is required`)
    .max(max, `${field} must be ${max} characters or fewer`);

const leadFields = {
  name: requiredText("Name", 80),
  email: requiredText("Email", 120).email("Email must be valid").toLowerCase(),
  phone: requiredText("Phone number", 30),
  companyName: requiredText("Company name", 120),
  status: z.enum(LEAD_STATUSES),
  notes: z
    .string()
    .trim()
    .max(2000, "Notes must be 2000 characters or fewer")
};

export const createLeadSchema = z.object({
  ...leadFields,
  status: leadFields.status.optional().default("New"),
  notes: leadFields.notes.optional().default("")
});

export const updateLeadSchema = z.object(leadFields).partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: "At least one field is required"
  }
);
