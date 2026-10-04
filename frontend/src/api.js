// Network API Client for Stateless AI Audio Analysis

export async function sendRecordingForAnalysis({
  backendUrl = "http://10.0.2.2:4000",
  audioUri,
  fileName = "call_recording.m4a",
  mimeType = "audio/mp4",
  callerNumber,
  callerName,
  callDuration = 0
}) {
  const formData = new FormData();

  formData.append("recording", {
    uri: audioUri,
    name: fileName,
    type: mimeType
  });

  formData.append("callerNumber", callerNumber || "Unknown");
  formData.append("callerName", callerName || "Unknown");
  formData.append("callDuration", String(callDuration));

  const url = `${backendUrl.replace(/\/$/, "")}/api/calls/analyze-recording`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/json"
    },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server returned ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  return result;
}
