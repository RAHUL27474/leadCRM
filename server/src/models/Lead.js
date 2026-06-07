import mongoose from "mongoose";

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Lost"
];

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 120,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: "New",
      required: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ""
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

leadSchema.index({ name: "text", email: "text", companyName: "text" });
leadSchema.index({ status: 1, createdAt: -1 });

export const Lead = mongoose.model("Lead", leadSchema);
