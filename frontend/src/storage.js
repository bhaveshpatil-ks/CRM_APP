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

// 2. Fetch all locally stored leads (No fake data, starts empty [])
export async function getLocalLeads() {
  try {
    const raw = await AsyncStorage.getItem(LEADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to load local leads:", error);
    return [];
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
