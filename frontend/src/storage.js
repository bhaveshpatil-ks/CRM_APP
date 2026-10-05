import AsyncStorage from "@react-native-async-storage/async-storage";

const LEADS_KEY = "@crm_leads";
const SETTINGS_KEY = "@crm_settings";
const USER_SESSION_KEY = "@crm_user_session";

// Clean phone digits helper (last 10 digits for matching)
export function normalizePhone(phone = "") {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

// 1. User Session Management (Website Connected Login)
export async function getStoredSession() {
  try {
    const raw = await AsyncStorage.getItem(USER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveUserSession(session) {
  try {
    await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Failed to save session:", error);
  }
}

export async function clearUserSession() {
  try {
    await AsyncStorage.removeItem(USER_SESSION_KEY);
  } catch (error) {
    console.error("Failed to clear session:", error);
  }
}

export const DEFAULT_SEED_LEADS = [
  {
    id: "lead_seed_1",
    name: "Rajesh Mehta",
    phone: "+91 98200 45120",
    normalizedPhone: "9820045120",
    company: "Apex Enterprises",
    status: "Quoting",
    totalCalls: 1,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    lastContactedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    nextFollowUpAt: "Today 4:00 PM",
    calls: [
      {
        id: "call_seed_1",
        date: new Date(Date.now() - 3600000 * 2).toISOString(),
        durationSeconds: 142,
        callerNumber: "+91 98200 45120",
        callerName: "Rajesh Mehta",
        sentiment: "Warm",
        exactSummary: {
          headline: "Q4 Supply contract negotiation & payment terms agreed",
          keyOutcome: "Quoting",
          bullets: [
            "Agreed on 12% bulk volume discount for 500 units order",
            "Delivery commitment confirmed within 14 working days",
            "Client requested formal proforma quote via WhatsApp by 4 PM"
          ]
        },
        detailedNotes: {
          callerIntent: "Negotiating Q4 batch delivery price & credit terms",
          discussionPoints: [
            "Requested net-30 payment terms instead of standard net-15",
            "Inquired about buffer stock availability in West Region hub"
          ],
          commitmentsMade: [
            "Promised delivery within 14 days post PO issuance",
            "Agreed to waive shipping charges on first container"
          ],
          actionChecklist: [
            { id: "task_1", task: "Dispatch updated proforma invoice with 12% volume discount", completed: false },
            { id: "task_2", task: "Confirm West Region warehouse stock reservation with logistics", completed: true }
          ],
          suggestedFollowUp: {
            dueDate: "Today 4:00 PM",
            recommendedAction: "Send WhatsApp Proforma Quote",
            draftMessage: "Hi Rajesh, following our call, please find attached the revised proforma invoice reflecting the 12% volume rebate. Let us know once approved."
          }
        }
      }
    ]
  },
  {
    id: "lead_seed_2",
    name: "Ananya Deshmukh",
    phone: "+91 98111 87654",
    normalizedPhone: "9811187654",
    company: "Zen Cloud Labs",
    status: "Warm",
    totalCalls: 1,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    lastContactedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    nextFollowUpAt: "Tomorrow 11:00 AM",
    calls: [
      {
        id: "call_seed_2",
        date: new Date(Date.now() - 3600000 * 24).toISOString(),
        durationSeconds: 215,
        callerNumber: "+91 98111 87654",
        callerName: "Ananya Deshmukh",
        sentiment: "High Intent",
        exactSummary: {
          headline: "Architecture review and on-device privacy validation",
          keyOutcome: "Warm",
          bullets: [
            "Validated 100% on-device private storage without cloud DB sync",
            "Requested custom API webhook integration documentation",
            "Scheduled engineering walkthrough sync for Thursday 11 AM"
          ]
        },
        detailedNotes: {
          callerIntent: "Verifying security compliance & private on-device storage",
          discussionPoints: [
            "Needs confirmation that audio transcripts never leave local device memory",
            "Reviewing team seat licensing for 8 outbound reps"
          ],
          commitmentsMade: [
            "Send integration documentation link and calendar invite"
          ],
          actionChecklist: [
            { id: "task_3", task: "Share API webhook documentation link via WhatsApp", completed: false },
            { id: "task_4", task: "Send calendar invite for Thursday technical sync", completed: false }
          ],
          suggestedFollowUp: {
            dueDate: "Tomorrow 11:00 AM",
            recommendedAction: "Send Integration Documentation",
            draftMessage: "Hello Ananya, thank you for your time today. As discussed, our CRM architecture keeps all call notes strictly on-device. Here is our technical integration overview."
          }
        }
      }
    ]
  }
];

// 2. Fetch all locally stored leads (Seeds realistic showcase pipeline on initial run)
export async function getLocalLeads() {
  try {
    const raw = await AsyncStorage.getItem(LEADS_KEY);
    if (!raw) {
      await AsyncStorage.setItem(LEADS_KEY, JSON.stringify(DEFAULT_SEED_LEADS));
      return DEFAULT_SEED_LEADS;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to load local leads:", error);
    return DEFAULT_SEED_LEADS;
  }
}

// 3. Save all leads to on-device AsyncStorage
export async function saveLocalLeads(leads) {
  try {
    await AsyncStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  } catch (error) {
    console.error("Failed to save local leads:", error);
  }
}

// 3b. Toggle an action task item completion status
export async function toggleTaskStatus(leadId, callId, taskId) {
  try {
    const leads = await getLocalLeads();
    const updated = leads.map((lead) => {
      if (lead.id !== leadId) return lead;
      const updatedCalls = (lead.calls || []).map((c) => {
        if (c.id !== callId) return c;
        const currentList = c.detailedNotes?.actionChecklist || [];
        const updatedList = currentList.map((item) => {
          const itemId = typeof item === "object" ? item.id || item.task : item;
          if (itemId === taskId || item.task === taskId) {
            return typeof item === "object" ? { ...item, completed: !item.completed } : { task: item, completed: true };
          }
          return item;
        });
        return {
          ...c,
          detailedNotes: {
            ...c.detailedNotes,
            actionChecklist: updatedList
          }
        };
      });
      return { ...lead, calls: updatedCalls };
    });
    await saveLocalLeads(updated);
    return updated;
  } catch (error) {
    console.error("Failed to toggle task status:", error);
    return null;
  }
}

// 3c. Restore showcase sample data
export async function resetToSampleData() {
  try {
    await AsyncStorage.setItem(LEADS_KEY, JSON.stringify(DEFAULT_SEED_LEADS));
    return DEFAULT_SEED_LEADS;
  } catch (error) {
    console.error("Failed to reset sample leads:", error);
    return DEFAULT_SEED_LEADS;
  }
}

// 4. Attach call analysis directly to contact's local history
export async function addOrUpdateLeadFromCall(callData) {
  try {
    const leads = await getLocalLeads();
    const cleanNumber = normalizePhone(callData.callerNumber);

    let lead = leads.find((l) => normalizePhone(l.phone) === cleanNumber);

    const callRecord = {
      id: `call_${Date.now()}`,
      date: new Date().toISOString(),
      durationSeconds: Number(callData.callDuration) || 0,
      callerNumber: callData.callerNumber,
      callerName: callData.callerName || (lead ? lead.name : "Unknown"),
      exactSummary: callData.exactSummary,
      detailedNotes: callData.detailedNotes,
      sentiment: callData.sentiment || "Neutral",
      transcript: callData.transcript || ""
    };

    if (lead) {
      if (!lead.calls) lead.calls = [];
      lead.calls.unshift(callRecord);
      lead.lastContactedAt = new Date().toISOString();
      lead.totalCalls = (lead.totalCalls || 0) + 1;
      lead.status = callData.leadStatus || lead.status;
      if (callData.detailedNotes?.suggestedFollowUp?.dueDate) {
        lead.nextFollowUpAt = callData.detailedNotes.suggestedFollowUp.dueDate;
      }
    } else {
      lead = {
        id: `lead_${Date.now()}`,
        name: callData.callerName || `Contact ${cleanNumber}`,
        phone: callData.callerNumber,
        normalizedPhone: cleanNumber,
        company: "Direct Contact",
        status: callData.leadStatus || "New",
        totalCalls: 1,
        createdAt: new Date().toISOString(),
        lastContactedAt: new Date().toISOString(),
        nextFollowUpAt: callData.detailedNotes?.suggestedFollowUp?.dueDate || null,
        calls: [callRecord]
      };
      leads.unshift(lead);
    }

    await saveLocalLeads(leads);
    return lead;
  } catch (error) {
    console.error("Failed to update lead from call:", error);
    throw error;
  }
}

// 5. Delete specific lead
export async function deleteLeadById(id) {
  try {
    const leads = await getLocalLeads();
    const updated = leads.filter((l) => l.id !== id);
    await saveLocalLeads(updated);
    return updated;
  } catch (error) {
    console.error("Failed to delete lead:", error);
    throw error;
  }
}

// 6. Wipe all on-device data
export async function clearLocalData() {
  try {
    await AsyncStorage.removeItem(LEADS_KEY);
  } catch (error) {
    console.error("Failed to clear local leads:", error);
  }
}

// 7. Settings Persistence
export async function getLocalSettings() {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          backendUrl: "http://10.0.2.2:4000",
          websiteUrl: "http://localhost:5173",
          recordingStoragePath: "/storage/emulated/0/Recordings/Call",
          autoSyncCalls: true,
          skipShortCalls: true,
          autoDraftWhatsApp: true
        };
  } catch {
    return {
      backendUrl: "http://10.0.2.2:4000",
      websiteUrl: "http://localhost:5173",
      recordingStoragePath: "/storage/emulated/0/Recordings/Call",
      autoSyncCalls: true,
      skipShortCalls: true,
      autoDraftWhatsApp: true
    };
  }
}

export async function saveLocalSettings(settings) {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save local settings:", error);
  }
}
