// Android Native Permissions Manager & On-Device Storage Helper

export const ANDROID_PERMISSIONS = [
  {
    id: "READ_PHONE_STATE",
    name: "Phone State & Call Detection",
    description: "Detects when incoming or outgoing calls start and hang up to trigger auto-sync.",
    category: "Telephony",
    required: true
  },
  {
    id: "READ_CALL_LOG",
    name: "Call Logs & Contact Matching",
    description: "Accesses caller phone number, contact name, and call duration to match lead profiles.",
    category: "Call Log",
    required: true
  },
  {
    id: "READ_MEDIA_AUDIO",
    name: "Voice & Recording Storage Access",
    description: "Allows the app to read recorded call audio files (.m4a, .mp3, .amr) from device storage.",
    category: "Storage",
    required: true
  },
  {
    id: "RECORD_AUDIO",
    name: "Microphone & Audio Capture",
    description: "Enables in-app audio recording and waveform visualization.",
    category: "Audio",
    required: false
  }
];

const PERMISSIONS_STORAGE_KEY = "crm_android_permissions";

export const getStoredPermissions = () => {
  try {
    const saved = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn("Failed to read permissions from local storage:", e);
  }
  // Default: All permissions granted for seamless local app operation
  return {
    READ_PHONE_STATE: true,
    READ_CALL_LOG: true,
    READ_MEDIA_AUDIO: true,
    RECORD_AUDIO: true
  };
};

export const saveStoredPermissions = (perms) => {
  try {
    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(perms));
  } catch (e) {
    console.warn("Failed to save permissions to local storage:", e);
  }
};
