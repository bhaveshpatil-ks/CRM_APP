import { PermissionsAndroid, Platform } from "react-native";

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
  if (Platform.OS !== "android") return true;

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
  if (Platform.OS !== "android") return { allGranted: true };

  const statuses = {};
  for (const perm of REQUIRED_PERMISSIONS) {
    if (perm.key) {
      statuses[perm.key] = await PermissionsAndroid.check(perm.key);
    }
  }

  const allGranted = Object.values(statuses).every(Boolean);
  return { allGranted, statuses };
}
