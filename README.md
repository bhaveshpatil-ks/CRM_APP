<div align="center">

  <svg viewBox="0 0 64 64" width="80" height="80">
    <defs>
      <linearGradient id="brandGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d6ff73" />
        <stop offset="100%" stopColor="#8de31a" />
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="52" height="52" rx="18" fill="#111111" />
    <path d="M21 24.5c3.2-5.6 7.8-8.4 14-8.4 4.5 0 8 1.2 10.7 3.5l-3.7 4.3c-1.8-1.4-4-2.1-6.5-2.1-3.7 0-6.7 1.6-8.8 4.7-1.1 1.6-1.8 3.2-2.1 4.8h13.5v5.9H24.7c.4 1.8 1.2 3.5 2.4 5.1 2.2 2.9 5.1 4.4 8.8 4.4 2.8 0 5.2-.8 7.3-2.5l3.6 4.2c-3.1 2.8-6.9 4.2-11.4 4.2-6.3 0-11.2-2.6-14.7-7.9-1.6-2.4-2.7-4.9-3.1-7.6h-4.2v-5.9h3.9c.6-2.6 1.5-5.1 2.8-7.3Z" fill="url(#brandGlow)" />
    <path d="M33 20.5h14.5v5.5H39v5.7h7.8v5.3H39V48h-6V20.5Z" fill="#ffffff" opacity="0.96" />
  </svg>

  # CRM_APP: Android AI Call CRM Platform

  **A modern, high-performance Android mobile AI CRM platform that auto-syncs phone call recordings, generates instant AI summaries (GPT-4o / Ollama), and manages lead pipelines with 1-tap SMS. Built exclusively for Android.**

  [Repository](https://github.com/bhaveshpatil-ks/CRM_APP) • [Features](#key-features) • [Android Architecture](#mobile--android-native-architecture) • [AI Pipeline](#multi-engine-ai-summarizer-pipeline) • [Website Portal](https://github.com/bhaveshpatil-ks/CRM-Website)

  <br />

  [![Platform](https://img.shields.io/badge/PLATFORM-ANDROID_ONLY-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://android.com/)
  [![React](https://img.shields.io/badge/REACT_18-090D16?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/VITE_5-090D16?style=for-the-badge&logo=vite&logoColor=646CFF)](https://vitejs.dev/)
  [![Android Bridge](https://img.shields.io/badge/ANDROID_NATIVE_BRIDGE-090D16?style=for-the-badge&logo=android&logoColor=3DDC84)](https://android.com/)
  [![Node.js](https://img.shields.io/badge/NODE.JS_EXPRESS-090D16?style=for-the-badge&logo=nodedotjs&logoColor=339933)](https://nodejs.org/)
  [![License: MIT](https://img.shields.io/badge/LICENSE-MIT-10b981?style=for-the-badge)](LICENSE)

</div>

---

## 📱 Overview

**CRM_APP** is a full-stack mobile sales intelligence and call automation application engineered to eliminate post-call manual entry friction and turn phone call recordings into structured, actionable CRM leads instantly.

Instead of sales representatives manually typing call notes or forgetting follow-up commitments, **CRM_APP** automatically detects when phone calls end, captures raw recording audio, transcribes spoken dialogue, generates structured executive summaries with action item checklists, assigns commercial sentiment tags, and updates the sales pipeline in real time.

---

## 🏛️ Above-The-Fold 4 Pillars Architecture

At the top of the application dashboard and login view, the interface immediately articulates its core identity:

| Pillar | Category | Description |
| :--- | :--- | :--- |
| **01 // WHAT IT IS** | Core Product | Autonomous Mobile Call CRM that converts phone call recordings into actionable summaries, transcripts, and task checklists. |
| **02 // WHO IT IS FOR** | Universal Audience | **All types of users**: Sales reps, freelancers, consultants, real estate brokers, field technicians, contractors, and business owners. |
| **03 // WHY IT MATTERS** | Value Proposition | Zero manual note-taking friction, 100% conversation recall, instant 1-tap carrier SMS follow-ups, and zero third-party telecom fees. |
| **04 // WHAT TO DO NEXT** | Primary Action | Authenticate your Company ID or launch **Live Interactive Demo** to explore real call ingestion and AI processing. |

---

## 👥 Built for Every Type of User

CRM_APP is engineered to provide instant intelligent call summaries across every profession:

- **Sales Reps & Account Executives**: Summarizes customer requirements, pricing discussions, objections, and prepares 1-tap WhatsApp/SMS quotes.
- **Freelancers, Designers & Developers**: Automatically logs scope changes, client revisions, deliverable dates, and budget adjustments from phone briefings.
- **Real Estate Brokers**: Captures buyer budget limits, desired property configurations, location preferences, and scheduled site visits.
- **Field Technicians & Contractors**: Automatically extracts customer street addresses, equipment model numbers, reported faults, and arrival windows.
- **Small Business Owners & Shopkeepers**: Keeps a permanent searchable record of wholesale orders, supplier quotations, and payment terms without jotting notes on paper.
- **Everyday Professionals**: Summarizes critical vendor calls, medical appointment details, and customer service reference numbers.

---

## ⚡ Mobile & Android Native Architecture

CRM_APP is architected with a mobile-first design system (`375px × 720px` responsive phone shell) ready for standalone deployment or wrapping via **Android Native / React Native** (using `react-native-webview` or native bridging).

```text
┌─────────────────────────────────────────────────────────────┐
│                      NATIVE ANDROID OS                      │
├──────────────────────────────┬──────────────────────────────┤
│ TelephonyManager & Call State│ FileObserver / MediaStore    │
│ (ACTION_PHONE_STATE_CHANGED) │ (/Recordings/Call directory) │
└──────────────┬───────────────┴──────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│            REACT NATIVE / HEADLESS JS BRIDGE                │
│  - Filters calls < 10s (Missed / Voicemail filter)          │
│  - Extracts audio buffer (M4A / AAC / MP3 / WAV)            │
│  - Emits: window.postMessage({ type: 'CALL_SYNC_COMPLETED'})│
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 CRM_APP CLIENT APPLICATION                  │
│  - Audio Oscilloscope Studio (Waveform & range scrubber)    │
│  - Multi-Engine AI Summarizer (Built-in / GPT-4o / Ollama)   │
│  - 3-Level Lead Directory Drilldown                         │
│  - Universal Deep Search & Pipeline Manager                 │
│  - 1-Tap Carrier Actions: tel:${phone} & sms:${phone}       │
└─────────────────────────────────────────────────────────────┘
```

### 1. Native Android Call Recording Sync Mechanism
- **Call State Listener**: Android's `TelephonyManager` / `PhoneStateListener` listens for the phone state transitioning from `CALL_STATE_OFFHOOK` to `CALL_STATE_IDLE`.
- **Directory Watcher**: A native `FileObserver` monitors the device's call recording storage directory (e.g. `/storage/emulated/0/Recordings/Call` or `/CallRecordings`).
- **Short Call Filter**: Calls under 10 seconds in duration are classified as missed calls or wrong numbers and automatically filtered out to keep the CRM clean.
- **Audio Extraction**: The raw audio file is indexed with metadata (timestamp, phone number, duration) and bridged to the CRM ingestion pipeline.

### 2. Android Permissions & 100% On-Device Private Storage
- **Zero Cloud Database Cost & Maximum Privacy**: All call notes, executive summaries, caller history, and lead contact lists (e.g., Rajesh) are stored **100% on the user's phone storage** (`localStorage` / SQLite). No personal customer calls or contact records are saved in any central cloud database.
- **Declared Android Permissions (`AndroidManifest.xml`)**:
  - `READ_PHONE_STATE`: Detects incoming/outgoing call status and hang-up triggers.
  - `READ_CALL_LOG`: Accesses caller phone number, contact name, and call duration.
  - `READ_MEDIA_AUDIO` / `READ_EXTERNAL_STORAGE`: Reads recorded audio files (`.m4a`, `.mp3`, `.amr`) from device storage.
  - `RECORD_AUDIO`: Microphone audio capture & waveform visualization.
  - `FOREGROUND_SERVICE` & `RECEIVE_BOOT_COMPLETED`: Keeps background call monitor active across device reboots.

### 3. Android Native Integration Bridge
To bundle CRM_APP into an Android `.apk`:
```javascript
// Native Android HeadlessJsTaskService / WebView Bridge Example
import { WebView } from 'react-native-webview';

export default function NativeAppShell() {
  const handleMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'TRIGGER_NATIVE_DIALER') {
      Linking.openURL(`tel:${data.phone}`);
    } else if (data.type === 'TRIGGER_NATIVE_SMS') {
      Linking.openURL(`sms:${data.phone}?body=${encodeURIComponent(data.message)}`);
    }
  };

  return (
    <WebView
      source={{ uri: 'https://your-crm-app-domain.vercel.app' }}
      onMessage={handleMessage}
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
    />
  );
}
```

---

## 🤖 Multi-Engine AI Summarizer Pipeline

CRM_APP supports three interchangeable AI inference backends configured dynamically from in-app settings:

| Provider | Connectivity | Setup Required | Best For |
| :--- | :--- | :--- | :--- |
| **Built-in Smart AI** | 100% Offline | None (Zero-setup) | Instant call analysis, key phrase matching, and action items with zero latency and zero API cost. |
| **Cloud OpenAI (GPT-4o)** | Cloud API | API Key in Settings | Enterprise commercial intent scoring, complex nuance detection, and objection handling analysis. |
| **Local Ollama (Llama 3.2)** | Localhost Edge | Local Ollama running | 100% private, on-premise execution where audio transcripts never leave the corporate perimeter. |

### Summary Output Structure:
- **`[ SPECIMEN // EXECUTIVE_SUMMARY ]`**: High-density 2-sentence briefing capturing the primary customer request and agreed resolution.
- **`[ ACTION // CHECKLIST ]`**: Extracted actionable tasks formatted into interactive checkboxes (e.g., *Dispatch formal PDF contract*, *Verify shipping address*).
- **Commercial Intent Badge**: Automatically graded intent status (`Positive / High Intent`, `Warm / Follow-Up Needed`, `Urgent / Support Escalation`).
- **1-Tap Suggested SMS**: Pre-formatted follow-up SMS ready to send directly via the mobile device carrier with a single tap.

---

## 🎛️ Audio Oscilloscope Studio

The app features an integrated audio playback laboratory:
- **Waveform Visualizer**: Generates dynamic audio bar amplitudes corresponding to conversation energy.
- **Minimalist Range Scrubber**: Custom range slider with high-contrast indicator thumb (`#10b981`) and digital monospace clock counters (`00:00 / 02:45`).
- **Clean Vector Controls**: Crisp vector SVGs for Play and Pause (zero emoji or font glyph inconsistencies across platforms).
- **Speed Multiplier**: Multi-speed playback toggle (`1.0x`, `1.5x`, `2.0x`).

---

## 🔑 Key Features

### 1. 3-Level Lead Directory Drilldown
- **Level 1 (Directory)**: Searchable list of all customer contacts with industry tags, last contact date, and stage badges.
- **Level 2 (Audio History)**: View all recorded calls with duration meters and timestamped history for that specific lead.
- **Level 3 (Inspection Studio)**: Full AI executive summary, action items checklist, audio player, and complete spoken transcript.

### 2. Universal Deep Search
Multi-target indexing allowing reps to search across:
- **Contact Names & Phone Numbers**
- **AI Summary Concepts & Commercial Topics**
- **Spoken Transcript Words**
- **App Settings Options** (e.g. typing "biometric" jumps directly to security settings)

### 3. Zero-Telecom-Cost 1-Tap Actions
- Tap **Call** to launch the device's native carrier dialer (`tel:${phone}`).
- Tap **Send Mobile SMS** to launch the device's native SMS app (`sms:${phone}?body=...`).
- Eliminates expensive per-minute VoIP/telephony API fees (e.g. Twilio, Plivo).

### 4. Enterprise Security & Biometrics
- **Profile Lock**: Read-only profile view with an explicit `Edit Details` toggle.
- **Two-Factor OTP Security**: Edits require 4-digit verification code (`1234`) dispatched via SMS or Company Email.
- **Android Biometric / Fingerprint Lock**: In-app toggle for biometric verification on boot.
- **Permanent Account Purge**: Instant wipe of local credentials, session tokens, and cached lead records.

---

## 📂 Project Directory Structure

```text
CRM_APP/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI build verification workflow
├── frontend/                    # React 18 Mobile Application
│   ├── public/                  # Static assets & brand mark
│   ├── src/
│   │   ├── api.js               # Multi-engine AI client (Built-in, OpenAI, Ollama)
│   │   ├── App.jsx              # Mobile application container & router
│   │   ├── main.jsx             # React DOM entrypoint
│   │   ├── sampleData.js        # Lead records, audio transcripts & industry presets
│   │   └── styles.css           # Minimal mobile design system & waveform styles
│   ├── index.html               # Mobile viewport & Google Fonts (Inter + JetBrains Mono)
│   ├── package.json             # Frontend dependencies & Vite scripts
│   └── vite.config.js           # Vite bundler configuration
├── backend/                     # Node.js Express 4 API Server
│   ├── package.json             # Express dependencies (express, cors)
│   └── server.js                # Express API server & CORS configuration
├── .gitignore                   # Ignores node_modules, build output, and separate web repo
├── package.json                 # Root script container
└── README.md                    # Mobile app architecture & documentation
```

---

## 🚀 Quick Start (Run Locally)

### 1. Clone the Repository
```bash
git clone https://github.com/bhaveshpatil-ks/CRM_APP.git
cd CRM_APP
```

### 2. Run the Mobile Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs locally at: `http://localhost:5173`*

### 3. Run the Backend API Server (Optional for Cloud AI)
```bash
cd ../backend
npm install
node server.js
```
*Backend runs locally at: `http://localhost:4000`*

---

## 🔑 Demo & Test Credentials

You can test the mobile application immediately:

- **Company ID**: `CALL-240001`
- **Password**: `demo123`
- **Demo Mode**: Click **`Live Interactive Demo`** on the login screen to launch preloaded leads without entering credentials.
- **2FA OTP Code**: `1234`

---

## 🔗 Related Repositories

- **Website & Company Portal**: [bhaveshpatil-ks/CRM-Website](https://github.com/bhaveshpatil-ks/CRM-Website) — Full-stack company onboarding, admin governance, and automated Company ID generator.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).