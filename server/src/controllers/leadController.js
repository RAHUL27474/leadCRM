import mongoose from "mongoose";
import { Lead, LEAD_STATUSES } from "../models/Lead.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { escapeRegex } from "../utils/escapeRegex.js";

const SORT_FIELDS = ["createdAt", "name", "email", "companyName", "status"];

function getPagination(query) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(Number.parseInt(query.limit, 10) || 10, 1),
    100
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
}

function getLeadQuery(query) {
  const filters = {};
  const status = query.status?.trim();
  const search = (query.search || query.q || "").trim();

  if (status && status !== "All") {
    if (!LEAD_STATUSES.includes(status)) {
      return {
        error: `Status must be one of: ${LEAD_STATUSES.join(", ")}`
      };
    }
    filters.status = status;
  }

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");
    filters.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { companyName: searchRegex }
    ];
  }

  return { filters };
}

export const getLeads = asyncHandler(async (req, res) => {
  const { filters, error } = getLeadQuery(req.query);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const { page, limit, skip } = getPagination(req.query);
  const sortBy = SORT_FIELDS.includes(req.query.sortBy)
    ? req.query.sortBy
    : "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";
  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [leads, total] = await Promise.all([
    Lead.find(filters).sort(sort).skip(skip).limit(limit).lean(),
    Lead.countDocuments(filters)
  ]);

  return res.json({
    data: leads,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      sortBy,
      sortOrder
    }
  });
});

export const getLeadStats = asyncHandler(async (req, res) => {
  const [total, statusGroups, recentLeads, topCompanies] = await Promise.all([
    Lead.countDocuments(),
    Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Lead.find().sort({ createdAt: -1 }).limit(5).lean(),
    Lead.aggregate([
      { $group: { _id: "$companyName", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 5 }
    ])
  ]);

  const byStatus = LEAD_STATUSES.reduce((accumulator, status) => {
    accumulator[status] = 0;
    return accumulator;
  }, {});

  statusGroups.forEach((group) => {
    byStatus[group._id] = group.count;
  });

  const converted = byStatus.Converted || 0;
  const conversionRate = total === 0 ? 0 : Math.round((converted / total) * 1000) / 10;

  return res.json({
    data: {
      total,
      byStatus,
      conversionRate,
      recentLeads,
      topCompanies: topCompanies.map((company) => ({
        companyName: company._id,
        count: company.count
      }))
    }
  });
});

export const createLead = asyncHandler(async (req, res) => {
  const lead = await Lead.create(req.body);
  return res.status(201).json({ data: lead });
});

export const updateLead = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid lead id" });
  }

  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  return res.json({ data: lead });
});

export const deleteLead = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid lead id" });
  }

  const lead = await Lead.findByIdAndDelete(req.params.id);

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  return res.status(204).send();
});
