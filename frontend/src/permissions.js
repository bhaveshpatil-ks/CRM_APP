import * as RN from "react-native";

const Platform = RN.Platform || { OS: "web", Version: 33 };

const PermissionsAndroid = RN.PermissionsAndroid || {
  PERMISSIONS: {
    READ_PHONE_STATE: "android.permission.READ_PHONE_STATE",
    READ_CALL_LOG: "android.permission.READ_CALL_LOG",
    READ_MEDIA_AUDIO: "android.permission.READ_MEDIA_AUDIO",
    READ_EXTERNAL_STORAGE: "android.permission.READ_EXTERNAL_STORAGE",
    RECORD_AUDIO: "android.permission.RECORD_AUDIO"
  },
  RESULTS: {
    GRANTED: "granted",
    DENIED: "denied",
    NEVER_ASK_AGAIN: "never_ask_again"
  },
  requestMultiple: async () => ({}),
  check: async () => true
};

export const REQUIRED_PERMISSIONS = [
  {
    key: PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    title: "Phone State Permission",
    message: "Required to detect when phone calls start and finish."
  },
  {
    key: PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
    title: "Call Log Access",
    message: "Required to match caller numbers, duration, and timestamps."
  },
  {
    key: Platform.Version >= 33
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    title: "Voice Storage Access",
    message: "Required to access call recording audio files from device storage."
  },
  {
    key: PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    title: "Microphone Access",
    message: "Required for in-app voice notes and audio playback waveform."
  }
];

// Request all required Android permissions sequentially
export async function requestAllPermissions() {
  if (Platform.OS !== "android") {
    return {
      allGranted: true,
      statuses: {
        "android.permission.READ_PHONE_STATE": "granted",
        "android.permission.READ_CALL_LOG": "granted",
        "android.permission.READ_MEDIA_AUDIO": "granted",
        "android.permission.RECORD_AUDIO": "granted"
      }
    };
  }

  try {
    const permissionsToRequest = REQUIRED_PERMISSIONS.map((p) => p.key).filter(Boolean);
    const granted = await PermissionsAndroid.requestMultiple(permissionsToRequest);

    const allGranted = Object.values(granted).every(
      (status) => status === PermissionsAndroid.RESULTS.GRANTED
    );

    return { allGranted, statuses: granted };
  } catch (err) {
    console.warn("Permission request error:", err);
    return { allGranted: false, statuses: {} };
  }
}

// Check current permission statuses
export async function checkPermissionsStatus() {
  if (Platform.OS !== "android") {
    return {
      allGranted: true,
      statuses: {
        "android.permission.READ_PHONE_STATE": true,
        "android.permission.READ_CALL_LOG": true,
        "android.permission.READ_MEDIA_AUDIO": true,
        "android.permission.RECORD_AUDIO": true
      }
    };
  }

  const statuses = {};
  for (const perm of REQUIRED_PERMISSIONS) {
    if (perm.key) {
      statuses[perm.key] = await PermissionsAndroid.check(perm.key);
    }
  }

  const allGranted = Object.values(statuses).every(Boolean);
  return { allGranted, statuses };
}
