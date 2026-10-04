import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { Lead } from "../models/Lead.js";
import { CallLog } from "../models/CallLog.js";
import { analyzeCallAudio } from "../services/aiService.js";

export const callRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

function getCleanPhone(phone = "") {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

// POST /api/calls/analyze-recording
callRouter.post("/analyze-recording", upload.single("recording"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Recording audio file is required" });
    }

    const { callerNumber, callerName, callDuration, callType } = req.body;
    if (!callerNumber) {
      return res.status(400).json({ error: "callerNumber is required" });
    }

    const cleanPhone = getCleanPhone(callerNumber);

    // 1. Process audio via AI service (Groq Whisper Turbo + Fast LLM)
    const aiResult = await analyzeCallAudio(req.file.buffer, req.file.mimetype);

    // 2. Check if MongoDB is connected
    const isDbConnected = mongoose.connection.readyState === 1;

    let leadData = {
      id: `lead_${cleanPhone}`,
      name: callerName || `Contact ${cleanPhone}`,
      phone: callerNumber,
      status: aiResult.leadStatus || "Warm"
    };

    let callData = {
      id: `call_${Date.now()}`,
      callerNumber,
      callerName: leadData.name,
      callDuration: Number(callDuration) || 0,
      callType: callType || "Incoming",
      exactSummary: aiResult.exactSummary,
      detailedNotes: aiResult.detailedNotes,
      sentiment: aiResult.sentiment,
      transcript: aiResult.transcript || "",
      provider: aiResult.provider || "Groq Whisper Turbo"
    };

    if (isDbConnected) {
      let lead = await Lead.findOne({ normalizedPhone: cleanPhone });

      if (!lead) {
        lead = new Lead({
          name: callerName || `Contact ${cleanPhone}`,
          phone: callerNumber,
          normalizedPhone: cleanPhone,
          status: aiResult.leadStatus || "Warm",
          totalCalls: 1
        });
      } else {
        lead.totalCalls += 1;
        lead.lastContactedAt = new Date();
        lead.status = aiResult.leadStatus || lead.status;
        if (callerName && lead.name.startsWith("Contact ")) {
          lead.name = callerName;
        }
      }

      if (aiResult.detailedNotes?.suggestedFollowUp?.dueDate) {
        lead.nextFollowUpAt = aiResult.detailedNotes.suggestedFollowUp.dueDate;
      }

      lead.notesTimeline.unshift({
        date: new Date(),
        headline: aiResult.exactSummary.headline
      });

      await lead.save();

      const callLog = new CallLog({
        leadId: lead._id,
        callerNumber,
        callerName: lead.name,
        callDuration: Number(callDuration) || 0,
        callType: callType || "Incoming",
        exactSummary: aiResult.exactSummary,
        detailedNotes: aiResult.detailedNotes,
        sentiment: aiResult.sentiment
      });

      await callLog.save();

      leadData = {
        id: lead._id,
        name: lead.name,
        phone: lead.phone,
        status: lead.status
      };
      callData = callLog;
    }

    return res.status(200).json({
      success: true,
      persistedToDb: isDbConnected,
      lead: leadData,
      call: callData
    });
  } catch (err) {
    console.error("Error analyzing call:", err);
    return res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});
