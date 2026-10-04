import express from "express";
import mongoose from "mongoose";
import { Lead } from "../models/Lead.js";
import { CallLog } from "../models/CallLog.js";

export const leadRouter = express.Router();

// GET /api/leads - List all contacts/leads
leadRouter.get("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const leads = await Lead.find().sort({ lastContactedAt: -1 });
    return res.json(leads);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/leads/:id - Dedicated Contact Page (e.g., Rajesh's page with all his calls and notes)
leadRouter.get("/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(404).json({ error: "Database offline. Start MongoDB to view persisted records." });
    }
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: "Contact not found" });
    }

    const calls = await CallLog.find({ leadId: lead._id }).sort({ createdAt: -1 });

    return res.json({
      contact: lead,
      calls
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/leads - Create contact manually
leadRouter.post("/", async (req, res) => {
  try {
    const { name, phone, company, status } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone are required" });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database offline. Connect MongoDB to save new leads." });
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    const lead = new Lead({
      name,
      phone,
      normalizedPhone: cleanPhone,
      company: company || "Individual",
      status: status || "New"
    });

    await lead.save();
    return res.status(201).json(lead);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
