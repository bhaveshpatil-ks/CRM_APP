# CRM_APP — Complete Repository Site Map

This document outlines the entire architecture, directory hierarchy, and purpose of every file within the **CRM_APP (Android AI Call CRM)** repository.

---

## 🏛️ System Architecture Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    ANDROID OS RUNTIME                       │
│  - TelephonyManager (Call State Listener: OFFHOOK -> IDLE)  │
│  - Native CallStateReceiver (Broadcast on hang-up)          │
│  - MediaStore / Storage (Auto-recorded audio detection)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   REACT NATIVE FRONTEND                     │
│  - App.jsx: Call Studio, Contact Dossier, Settings          │
│  - storage.js: 100% On-Device Storage (AsyncStorage)        │
│  - permissions.js: Android Runtime Permissions Handler      │
│  - api.js: Multipart audio uploader                         │
│  - previewEntry.jsx: Mobile shell frame for instant preview │
└──────────────────────────────┬──────────────────────────────┘
                               │ Multipart Audio (WAV / M4A)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               NODE.JS / EXPRESS AI BACKEND                  │
│  - server.js: Stateless REST Server                         │
│  - routes/callRoutes.js: /api/calls/analyze-recording       │
│  - services/aiService.js: Groq Whisper-Turbo (Transcription) │
│                          + Groq GPT-OSS-120B (AI Analysis)  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Directory Structure

```text
CRM_APP/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI build and verification workflow
├── android/                     # Native Android project configuration
│   ├── app/
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── AndroidManifest.xml   # Core Android permissions & Broadcast Receiver
│   │   │       ├── java/com/aicallcrm/app/
│   │   │       │   ├── CallStateReceiver.java # Native call-end broadcast listener
│   │   │       │   └── MainActivity.java     # Android Activity entrypoint
│   │   │       └── res/                 # App launcher icons, splash screens, layouts
│   │   └── build.gradle         # Android app build specifications
│   ├── build.gradle             # Top-level Gradle configuration
│   └── settings.gradle          # Gradle module inclusion settings
├── backend/                     # Node.js Express AI Audio Processing Backend
│   ├── config/
│   │   └── db.js                # Resilient database connection handler
│   ├── models/                  # Optional database schemas
│   │   ├── CallLog.js           # Call history schema definition
│   │   └── Lead.js              # Lead record schema definition
│   ├── routes/
│   │   ├── callRoutes.js        # POST /api/calls/analyze-recording endpoint
│   │   └── leadRoutes.js        # Lead retrieval routes
│   ├── services/
│   │   └── aiService.js         # Groq AI engine: Whisper transcription & JSON structuring
│   ├── package.json             # Backend dependencies (express, groq-sdk, multer)
│   └── server.js                # Backend entrypoint (CORS, body-parser, routes)
├── frontend/                    # React Native Android Application
│   ├── src/
│   │   ├── App.jsx              # Main React Native application UI & state engine
│   │   ├── api.js               # Network bridge sending audio files to backend
│   │   ├── asyncStorageMock.js  # Browser localStorage adapter for web preview
│   │   ├── permissions.js       # Android runtime permission requester
│   │   ├── previewEntry.jsx     # Mobile viewport shell wrapper for browser testing
│   │   └── storage.js           # 100% on-device private storage layer (AsyncStorage)
│   ├── app.json                 # React Native app metadata
│   ├── index.html               # Web preview HTML harness
│   ├── index.js                 # React Native AppRegistry entrypoint
│   ├── package.json             # Frontend dependencies & React Native configuration
│   └── vite.config.js           # Vite configuration with React Native Web aliases
├── .gitignore                   # Excludes node_modules, .env, and local build artifacts
├── package.json                 # Workspace root package configuration
└── README.md                    # Primary project documentation & architecture guide
```

---

## 🔍 File-By-File Description

### 1. Root Files
| File | Purpose |
| :--- | :--- |
| `README.md` | Primary documentation covering product overview, Android architecture, and local setup. |
| `SITEMAP.md` | Complete architectural site map and file reference. |
| `.gitignore` | Ensures `node_modules/`, `.env` secrets, and temporary build outputs remain untracked. |
| `package.json` | Root convenience scripts for running frontend, backend, or previewing simultaneously. |

### 2. Frontend Layer (`frontend/`)
| File | Purpose |
| :--- | :--- |
| `src/App.jsx` | Full React Native user interface: Call Studio, Contact Dossier, 1-tap WhatsApp/Call, Settings. |
| `src/storage.js` | On-device persistent storage using `AsyncStorage`. Zero cloud database exposure for user notes. |
| `src/permissions.js` | Android runtime permissions (`READ_PHONE_STATE`, `READ_CALL_LOG`, `RECORD_AUDIO`, etc.). |
| `src/api.js` | Multipart audio uploader delivering recordings to the backend AI analysis engine. |
| `src/asyncStorageMock.js` | Maps `AsyncStorage` calls to browser `localStorage` during preview mode. |
| `src/previewEntry.jsx` | Renders a 375px mobile device shell for testing without a physical Android phone. |
| `index.html` | Entry HTML for browser preview mode. |
| `index.js` | Native React Native `AppRegistry.registerComponent` entrypoint. |
| `vite.config.js` | Preview bundler configured with `react-native-web` alias for instant testing. |

### 3. Backend Layer (`backend/`)
| File | Purpose |
| :--- | :--- |
| `server.js` | Express server running on port 4000 with CORS and health checking. |
| `services/aiService.js` | High-speed AI pipeline: Whisper audio transcription + structured summary & action checklist generation. |
| `routes/callRoutes.js` | Handles `POST /api/calls/analyze-recording` using `multer` for memory file uploads. |
| `routes/leadRoutes.js` | REST endpoints for lead synchronization and querying. |
| `config/db.js` | Resilient MongoDB connection handler with graceful degradation if MongoDB is not running locally. |
| `models/Lead.js` | Optional MongoDB schema for lead management. |
| `models/CallLog.js` | Optional MongoDB schema for audio call logs. |

### 4. Native Android Layer (`android/`)
| File | Purpose |
| :--- | :--- |
| `AndroidManifest.xml` | Declares all required Android telephony, audio, and storage permissions along with the background receiver. |
| `CallStateReceiver.java` | Native Java BroadcastReceiver listening for call hang-up events (`CALL_STATE_IDLE`). |
| `MainActivity.java` | Main Android application activity entrypoint. |
| `build.gradle` | Gradle build script configuring compilation targets and SDK versions. |
