import React, { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import { INDUSTRY_PRESETS, INITIAL_LEADS } from "./sampleData";
import { api } from "./api";
import { getStoredPermissions, saveStoredPermissions, ANDROID_PERMISSIONS } from "./androidPermissions";

// APP SETTINGS SEARCH DICTIONARY FOR UNIVERSAL SEARCH
const SETTINGS_SEARCH_ITEMS = [
  {
    id: "set-0",
    title: "Android Permissions & Local Storage",
    subtitle: "Call logs, phone state, voice storage access & 100% on-device private data",
    keywords: ["permission", "permissions", "storage", "call log", "voice", "phone state", "private", "device", "local storage", "offline"],
    snippet: "Manage Android system permissions and on-device private storage"
  },
  {
    id: "set-1",
    title: "Mobile Call Recording & Auto-Sync",
    subtitle: "Auto-sync calls on hang-up, filter short calls (<10s), device folder path",
    keywords: ["recording", "storage", "path", "folder", "sync", "hang-up", "hangup", "filter", "short calls", "device", "mobile"],
    snippet: "Configure Android call recording storage directory and auto-sync behavior"
  },
  {
    id: "set-2",
    title: "AI Processing Engine & Provider",
    subtitle: "Built-in Smart AI (Instant - FREE), OpenAI GPT-4o, Gemini, Ollama Local Host",
    keywords: ["ai", "engine", "provider", "model", "llama", "ollama", "gpt", "openai", "gemini", "api key", "builtin", "smart ai"],
    snippet: "Choose zero-setup Built-in Smart AI or connect custom Cloud API / Local Ollama"
  },
  {
    id: "set-3",
    title: "Auto-Copy Summary to Clipboard",
    subtitle: "Automatically copy AI-generated call note to clipboard after call finishes",
    keywords: ["copy", "clipboard", "auto-copy", "summary", "notes", "share"],
    snippet: "Instantly copy structured call summaries for 1-tap pasting into WhatsApp / Email"
  },
  {
    id: "set-4",
    title: "Quick SMS Follow-up Template",
    subtitle: "Manage default message template for 1-tap mobile SMS follow-up button",
    keywords: ["sms", "template", "text", "message", "quick follow-up", "quote"],
    snippet: "Customize default follow-up text sent to leads after phone calls"
  },
  {
    id: "set-5",
    title: "Security & Biometric Lock",
    subtitle: "Brute-force protection, encrypted tokens & Android Biometric Lock",
    keywords: ["security", "auth", "lock", "biometric", "fingerprint", "device lock"],
    snippet: "Configure enterprise-grade encrypted tokens and Android Biometric lock"
  },
  {
    id: "set-6",
    title: "Export All CRM Leads to CSV",
    subtitle: "Download entire contact and lead database as a .CSV spreadsheet file",
    keywords: ["export", "csv", "backup", "download", "leads", "excel", "spreadsheet"],
    snippet: "Export caller records, phone numbers, and AI notes into a CSV file"
  },
  {
    id: "set-7",
    title: "Reset CRM Sample Data",
    subtitle: "Restore initial default contacts, pipeline leads, and sample call audio",
    keywords: ["reset", "restore", "clear", "sample data", "default"],
    snippet: "Revert all CRM lead stages and records back to initial state"
  },
  {
    id: "set-8",
    title: "Delete Account & Purge Data",
    subtitle: "Permanently erase account, call audio cache, and clear all lead profiles",
    keywords: ["delete", "account", "purge", "erase", "remove", "danger", "wipe"],
    snippet: "Permanently delete your AI Call CRM account and purge memory"
  }
];

// Modern Vector SVG Icons
const IconHome = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const IconCallLab = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
  </svg>
);

const IconPipeline = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 1-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconDashboard = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1"/>
    <rect width="7" height="5" x="14" y="3" rx="1"/>
    <rect width="7" height="9" x="14" y="12" rx="1"/>
    <rect width="7" height="5" x="3" y="16" rx="1"/>
  </svg>
);

const IconSearch = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconSettings = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconUser = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

// Brand Logo Component matching exact website UI theme
const BrandMark = () => (
  <span className="brand-mark" aria-hidden="true">
    <svg viewBox="0 0 64 64" role="presentation" focusable="false" style={{ width: "36px", height: "36px" }}>
      <defs>
        <linearGradient id="brandGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d6ff73" />
          <stop offset="100%" stopColor="#8de31a" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="18" fill="#111111" />
      <path
        d="M21 24.5c3.2-5.6 7.8-8.4 14-8.4 4.5 0 8 1.2 10.7 3.5l-3.7 4.3c-1.8-1.4-4-2.1-6.5-2.1-3.7 0-6.7 1.6-8.8 4.7-1.1 1.6-1.8 3.2-2.1 4.8h13.5v5.9H24.7c.4 1.8 1.2 3.5 2.4 5.1 2.2 2.9 5.1 4.4 8.8 4.4 2.8 0 5.2-.8 7.3-2.5l3.6 4.2c-3.1 2.8-6.9 4.2-11.4 4.2-6.3 0-11.2-2.6-14.7-7.9-1.6-2.4-2.7-4.9-3.1-7.6h-4.2v-5.9h3.9c.6-2.6 1.5-5.1 2.8-7.3Z"
        fill="url(#brandGlow)"
      />
      <path
        d="M33 20.5h14.5v5.5H39v5.7h7.8v5.3H39V48h-6V20.5Z"
        fill="#ffffff"
        opacity="0.96"
      />
    </svg>
  </span>
);

export default function App() {
  // AUTHENTICATION STATE
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loginCompanyId, setLoginCompanyId] = useState("CMP-84920");
  const [loginPassword, setLoginPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  
  const [enableBiometric, setEnableBiometric] = useState(true);
  
  // EDITABLE USER COMPANY PROFILE STATE
  const [userProfile, setUserProfile] = useState({
    companyId: "CMP-84920",
    companyName: "Shree Ram Enterprises",
    phone: "+91 98230 44120",
    address: "Phase 2, Industrial Estate, Mumbai",
    email: "contact@shreeram.com",
    sessionToken: "Bearer auth_token_89f41029ca9812df04b12",
    loginTime: new Date().toLocaleTimeString()
  });

  // EDIT PROFILE MODE STATE (DIRECT EDITING DISABLED BY DEFAULT!)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [draftProfile, setDraftProfile] = useState({ ...userProfile });
  
  // PROFILE OTP VERIFICATION MODAL STATE
  const [showProfileOtpModal, setShowProfileOtpModal] = useState(false);
  const [otpChannel, setOtpChannel] = useState("mobile"); // "mobile" | "email"
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState(["", "", "", ""]);
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Navigation State: "landing" | "recordings" | "pipeline" | "dashboard" | "search" | "settings" | "profile"
  const [currentView, setCurrentView] = useState("landing");
  
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState("manufacturing");
  // ON-DEVICE PRIVATE STORAGE: Leads persist 100% on user's device storage
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_local_leads");
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("crm_local_leads", JSON.stringify(leads));
    } catch (e) {
      console.warn("Failed to persist leads to local storage:", e);
    }
  }, [leads]);

  // ANDROID PERMISSIONS STATE
  const [androidPermissions, setAndroidPermissions] = useState(getStoredPermissions);
  const togglePermission = (key) => {
    const updated = { ...androidPermissions, [key]: !androidPermissions[key] };
    setAndroidPermissions(updated);
    saveStoredPermissions(updated);
  };

  // UNIVERSAL SEARCH STATE
  const [universalSearchQuery, setUniversalSearchQuery] = useState("");

  // PRACTICAL APP SETTINGS STATE
  const [aiProvider, setAiProvider] = useState("builtin");
  const [apiKey, setApiKey] = useState("");
  const [autoSummarize, setAutoSummarize] = useState(true);
  const [autoCopyClipboard, setAutoCopyClipboard] = useState(true);
  const [recordingStoragePath, setRecordingStoragePath] = useState("/storage/emulated/0/Recordings/CallCRM");
  const [autoSyncCalls, setAutoSyncCalls] = useState(true);
  const [skipShortCalls, setSkipShortCalls] = useState(true);
  const [highPriorityAlerts, setHighPriorityAlerts] = useState(true);
  const [smsTemplate, setSmsTemplate] = useState("Hi {name}, thanks for calling! Here is your quote summary.");
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [accountDeletedNotice, setAccountDeletedNotice] = useState(false);

  // PIPELINE STATE
  const [pipelineFilter, setPipelineFilter] = useState("All");
  const [summaryModalLead, setSummaryModalLead] = useState(null);

  // 3-LEVEL DRILL DOWN STATE FOR LEADS VIEW
  const [leadsSubView, setLeadsSubView] = useState("contacts");
  const [activeContact, setActiveContact] = useState(INITIAL_LEADS[0]);
  const [activeLeadCall, setActiveLeadCall] = useState(INDUSTRY_PRESETS[0].sampleCalls[0]);

  const dropdownRef = useRef(null);

  // Sync draftProfile whenever userProfile changes
  useEffect(() => {
    setDraftProfile({ ...userProfile });
  }, [userProfile]);

  // INITIALIZE LENIS SMOOTH SCROLL FOR LUXURY MOMENTUM SCROLLING
  useEffect(() => {
    const contentEl = document.querySelector(".mobile-content-body");
    if (!contentEl) return;

    const lenis = new Lenis({
      wrapper: contentEl,
      content: contentEl,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, [currentView, leadsSubView, isLoggedIn]);

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(222);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const timerRef = useRef(null);

  // AI Summarizer State
  const [aiResult, setAiResult] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [syncNotice, setSyncNotice] = useState(null);

  // Close industry popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIndustryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Audio Playback Timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, duration, playbackSpeed]);

  // Run AI Engine on active call
  const runAiEngine = async (callData) => {
    setIsSummarizing(true);
    try {
      const textToProcess = callData
        ? callData.summary + "\n" + callData.transcript.map(t => `${t.speaker}: ${t.text}`).join("\n")
        : activeLeadCall.summary;
      const res = await api.summarizeNote(textToProcess, aiProvider, apiKey);
      setAiResult({
        summary: callData ? callData.summary : res.summary,
        actionItems: callData ? callData.actionItems : ["Follow up with client", "Send quotation"],
        sentiment: callData ? callData.sentiment : res.outcome,
        extractedMetadata: callData ? callData.extractedMetadata : { "Part #": "VLV-316X", "Quantity": "500 Units" },
        provider: res.provider || "Built-in Smart AI"
      });
    } catch {
      setAiResult({
        summary: activeLeadCall.summary,
        actionItems: activeLeadCall.actionItems,
        sentiment: activeLeadCall.sentiment,
        extractedMetadata: activeLeadCall.extractedMetadata,
        provider: "Built-in Smart AI"
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  useEffect(() => {
    if (activeLeadCall) {
      runAiEngine(activeLeadCall);
    }
  }, [activeLeadCall, aiProvider, apiKey]);

  // DIRECT AUTH HANDLER
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError("");

    const companyIdClean = loginCompanyId.trim().toUpperCase();

    if (loginPassword === "wrong" || loginPassword === "123") {
      setAuthError("⚠️ Incorrect Company ID or Password. Please try again.");
      return;
    }

    if (!companyIdClean || !loginPassword) {
      setAuthError("⚠️ Please enter your Company Registration ID and Password.");
      return;
    }

    completeLogin(companyIdClean);
  };

  const completeLogin = (companyId) => {
    setUserProfile((prev) => ({
      ...prev,
      companyId: companyId || "CMP-84920",
      companyName: companyId === "CMP-84920" ? "Shree Ram Enterprises" : "Listed Business Corp",
      phone: "+91 98230 44120",
      sessionToken: `Bearer auth_token_${Math.random().toString(36).substring(2)}`,
      loginTime: new Date().toLocaleTimeString()
    }));
    setIsLoggedIn(true);
    setCurrentView("landing");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsEditingProfile(false);
  };

  // TRIGGER PROFILE VERIFICATION OTP MODAL WHEN USER CLICKS SAVE
  const handleInitiateProfileSave = (e) => {
    e.preventDefault();
    setShowProfileOtpModal(true);
    setOtpSent(false);
    setOtpInput(["", "", "", ""]);
  };

  const handleSendProfileOTP = () => {
    setOtpSent(true);
  };

  const handleVerifyProfileOTP = () => {
    const code = otpInput.join("");
    if (code !== "1234" && code.length < 4) {
      alert("⚠️ Invalid OTP code! Please enter the 4-digit verification code. (Demo OTP: 1234)");
      return;
    }
    // Success Verification -> Save changes & exit edit mode!
    setUserProfile({ ...draftProfile });
    setIsEditingProfile(false);
    setShowProfileOtpModal(false);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 4000);
  };

  // Save Settings Toast Handler
  const handleSaveSettings = () => {
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  // Confirm Account Deletion Handler
  const handleConfirmDeleteAccount = () => {
    setLeads([]);
    setDeleteAccountModalOpen(false);
    setIsLoggedIn(false);
    setAccountDeletedNotice(true);
    setTimeout(() => setAccountDeletedNotice(false), 6000);
  };

  // Export Leads CSV Handler
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Company,Phone,Status,Notes"].join(",") + "\n"
      + leads.map(l => `"${l.name}","${l.company}","${l.phone}","${l.status}","${(l.notes[0]||'').replace(/"/g, '""')}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AI_Call_CRM_Leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset Data Handler
  const handleResetData = () => {
    if (window.confirm("Reset all CRM leads back to initial state?")) {
      try {
        localStorage.removeItem("crm_local_leads");
      } catch (e) {
        console.warn("Storage clear error:", e);
      }
      setLeads(INITIAL_LEADS);
      alert("Local CRM leads reset successfully!");
    }
  };

  // Lead Status Change Handler
  const handleUpdateStatus = (leadId, newStatus) => {
    setLeads(prevLeads =>
      prevLeads.map(l => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
  };

  // Trigger Instant Call Sync & Lead Creation
  const handleTriggerSync = () => {
    const randomPhone = `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`;
    const randomName = ["Karan Sharma", "Deepak Verma", "Rohan Mehta", "Pooja Malhotra"][Math.floor(Math.random() * 4)];
    const randomCompany = ["Metro Properties", "Titan Logistics", "Sigma BioMed", "TechFab Industries"][Math.floor(Math.random() * 4)];

    const newDetectedCall = {
      id: `call-sync-${Date.now()}`,
      title: `Call Recording - ${randomName}`,
      client: `${randomName} (${randomCompany})`,
      rep: "Field Rep",
      duration: "02:45",
      industry: selectedIndustry,
      sentiment: "High Priority",
      date: new Date().toLocaleString(),
      audioSrc: "synced_call_recording.mp3",
      waveform: [40, 70, 95, 60, 85, 90, 45, 80, 95, 60, 40, 75, 90, 85, 60, 95, 50, 70, 85, 90, 60, 40, 95, 75, 85, 50, 90, 65, 45, 80],
      summary: `Automated call recording synced from mobile. AI extracted commercial quote request and delivery schedule.`,
      actionItems: [
        `Send formal proposal PDF to ${randomName} at ${randomCompany}.`,
        "Verify raw material inventory."
      ],
      extractedMetadata: { "Caller Phone": randomPhone, "Time": new Date().toLocaleTimeString(), "Status": "Lead Created" },
      transcript: [
        { speaker: "Agent", time: "0:02", text: "Hello! Thanks for reaching out. How can we help your team?" },
        { speaker: "Customer", time: "0:10", text: "We need urgent quotation for our batch order." }
      ]
    };

    const newLead = {
      id: `lead-sync-${Date.now()}`,
      name: randomName,
      company: randomCompany,
      phone: randomPhone,
      email: `${randomName.toLowerCase().replace(" ", ".")}@${randomCompany.toLowerCase().replace(" ", "")}.com`,
      industry: selectedIndustry,
      status: "New",
      nextFollowUpAt: new Date(Date.now() + 86400000).toISOString(),
      notes: [newDetectedCall.summary],
      interactions: [newDetectedCall]
    };

    setLeads([newLead, ...leads]);
    setActiveContact(newLead);
    setActiveLeadCall(newDetectedCall);
    setCurrentView("pipeline");
    runAiEngine(newDetectedCall);

    setSyncNotice({
      name: randomName,
      phone: randomPhone,
      time: new Date().toLocaleTimeString()
    });

    setTimeout(() => {
      setSyncNotice(null);
    }, 5000);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const currentPreset = INDUSTRY_PRESETS.find(p => p.id === selectedIndustry) || INDUSTRY_PRESETS[0];

  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.company.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.phone.includes(searchFilter)
  );

  const pipelineLeads = leads.filter(l => {
    if (pipelineFilter === "All") return true;
    return l.status === pipelineFilter;
  });

  const getCallsForContact = (contact) => {
    if (!contact) return INDUSTRY_PRESETS[0].sampleCalls;
    const matches = INDUSTRY_PRESETS.flatMap(p => p.sampleCalls).filter(c =>
      c.client.includes(contact.name) || c.client.includes(contact.company)
    );
    if (matches.length > 0) return matches;

    return [
      {
        id: `call-1-${contact.id}`,
        title: `Initial Call - ${contact.name}`,
        client: `${contact.name} (${contact.company})`,
        rep: "Field Representative",
        duration: "03:42",
        industry: contact.industry || "manufacturing",
        sentiment: "High Priority",
        date: "Today, 10:30 AM",
        audioSrc: "sample1.mp3",
        waveform: [35, 65, 80, 95, 70, 85, 60, 45, 90, 75, 80, 95, 60, 40, 70, 85, 90, 55, 75, 85],
        summary: `Inquired about product specifications, pricing tiers, and delivery schedule. AI requested follow-up PDF proposal.`,
        actionItems: [`Send quotation to ${contact.name}`, "Schedule technical demo call"],
        extractedMetadata: { "Caller": contact.name, "Phone": contact.phone, "Intent": "Purchase Quote" },
        transcript: [
          { speaker: "Agent", time: "0:02", text: "Hello! Thanks for connecting. How can we assist today?" },
          { speaker: "Customer", time: "0:08", text: "We need pricing details for our bulk requirements." }
        ]
      }
    ];
  };

  const getUniversalSearchResults = () => {
    const q = universalSearchQuery.trim().toLowerCase();
    if (!q) return [];

    const allCalls = INDUSTRY_PRESETS.flatMap(p => p.sampleCalls);
    const results = [];

    leads.forEach(lead => {
      const matchName = lead.name.toLowerCase().includes(q);
      const matchCompany = lead.company.toLowerCase().includes(q);
      const matchPhone = lead.phone.includes(q);
      const matchNotes = lead.notes.some(n => n.toLowerCase().includes(q));

      if (matchName || matchCompany || matchPhone || matchNotes) {
        results.push({
          type: "contact",
          matchType: matchName ? "Contact Name" : matchCompany ? "Company" : matchPhone ? "Phone" : "AI Note Word",
          title: lead.name,
          subtitle: `${lead.company} • ${lead.phone}`,
          snippet: lead.notes[0] || "Contact record in CRM",
          leadObj: lead
        });
      }
    });

    allCalls.forEach(call => {
      const matchTitle = call.title.toLowerCase().includes(q);
      const matchSummary = call.summary.toLowerCase().includes(q);
      const transcriptMatch = call.transcript.find(t => t.text.toLowerCase().includes(q));

      if (matchTitle || matchSummary || transcriptMatch) {
        results.push({
          type: "call",
          matchType: transcriptMatch ? "Spoken Words" : "Call Summary Word",
          title: call.title,
          subtitle: call.client,
          snippet: transcriptMatch ? `"${transcriptMatch.text}"` : call.summary,
          callObj: call
        });
      }
    });

    SETTINGS_SEARCH_ITEMS.forEach(setting => {
      const matchTitle = setting.title.toLowerCase().includes(q);
      const matchSubtitle = setting.subtitle.toLowerCase().includes(q);
      const matchKeywords = setting.keywords.some(k => k.toLowerCase().includes(q));

      if (matchTitle || matchSubtitle || matchKeywords) {
        results.push({
          type: "setting",
          matchType: "Settings Match",
          title: setting.title,
          subtitle: setting.subtitle,
          snippet: setting.snippet,
          settingObj: setting
        });
      }
    });

    return results;
  };

  const searchResults = getUniversalSearchResults();
  const companyInitials = userProfile.companyName ? userProfile.companyName.substring(0, 2).toUpperCase() : "SR";

  return (
    <div className="mobile-app-wrapper">
      {/* TRANSLUCENT GLASSMORPHISM TOP NAVBAR */}
      <header className="app-topbar">
        {/* Left Top: App Logo Only */}
        <div className="topbar-logo-left" onClick={() => setCurrentView("landing")}>
          <BrandMark />
        </div>

        {/* Right Top: Custom React Industry Popover Menu + USER PROFILE ICON */}
        <div className="topbar-actions-right">
          {isLoggedIn && (
            <div className="custom-dropdown-container" ref={dropdownRef}>
              <button
                type="button"
                className={`custom-dropdown-trigger ${industryDropdownOpen ? "open" : ""}`}
                onClick={() => setIndustryDropdownOpen(!industryDropdownOpen)}
              >
                <span>{currentPreset.name.split(" ")[0]}</span>
                <span className="custom-dropdown-arrow">▼</span>
              </button>

              {/* Floating Custom Popover Menu */}
              {industryDropdownOpen && (
                <div className="custom-dropdown-menu">
                  {INDUSTRY_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`dropdown-item-btn ${selectedIndustry === p.id ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedIndustry(p.id);
                        setIndustryDropdownOpen(false);
                        if (p.sampleCalls[0]) {
                          setActiveLeadCall(p.sampleCalls[0]);
                        }
                      }}
                    >
                      <span>{p.name}</span>
                      {selectedIndustry === p.id && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* USER PROFILE ICON BUTTON */}
          <button
            type="button"
            className={`user-profile-btn ${currentView === "profile" ? "active-profile" : ""}`}
            onClick={() => {
              setCurrentView("profile");
              setIsEditingProfile(false);
            }}
            aria-label="Open Company Profile Page"
            title="Company Profile & Account Details"
          >
            {isLoggedIn ? companyInitials : <IconUser />}
          </button>
        </div>
      </header>

      {/* FLOATING GLASSMORPHIC BOTTOM NAVBAR (Visible when logged in) */}
      {isLoggedIn && (
        <div className="bottom-navbar-wrap">
          <nav className="bottom-navbar" aria-label="Icon Bottom Navigation">
            <button
              type="button"
              className={`nav-icon-btn ${currentView === "landing" ? "active" : ""}`}
              onClick={() => setCurrentView("landing")}
              title="Home Page"
            >
              <IconHome />
              {currentView === "landing" && <span className="nav-active-dot" />}
            </button>

            <button
              type="button"
              className={`nav-icon-btn ${currentView === "recordings" ? "active" : ""}`}
              onClick={() => {
                setCurrentView("recordings");
                setLeadsSubView("contacts");
              }}
              title="Contacts & Leads"
            >
              <IconCallLab />
              {currentView === "recordings" && <span className="nav-active-dot" />}
            </button>

            <button
              type="button"
              className={`nav-icon-btn ${currentView === "pipeline" ? "active" : ""}`}
              onClick={() => setCurrentView("pipeline")}
              title="Lead Pipeline"
            >
              <IconPipeline />
              {currentView === "pipeline" && <span className="nav-active-dot" />}
            </button>

            <button
              type="button"
              className={`nav-icon-btn ${currentView === "dashboard" ? "active" : ""}`}
              onClick={() => setCurrentView("dashboard")}
              title="Dashboard Metrics"
            >
              <IconDashboard />
              {currentView === "dashboard" && <span className="nav-active-dot" />}
            </button>

            <button
              type="button"
              className={`nav-icon-btn ${currentView === "search" ? "active" : ""}`}
              onClick={() => setCurrentView("search")}
              title="Universal Search"
            >
              <IconSearch />
              {currentView === "search" && <span className="nav-active-dot" />}
            </button>

            <button
              type="button"
              className={`nav-icon-btn ${currentView === "settings" ? "active" : ""}`}
              onClick={() => setCurrentView("settings")}
              title="App Settings"
            >
              <IconSettings />
              {currentView === "settings" && <span className="nav-active-dot" />}
            </button>
          </nav>
        </div>
      )}

      {/* OTP VERIFICATION MODAL FOR SAVING PROFILE CHANGES */}
      {showProfileOtpModal && (
        <>
          <div className="drawer-backdrop" onClick={() => setShowProfileOtpModal(false)} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "90%", maxWidth: "340px", background: "#ffffff", borderRadius: "6px", border: "1px solid var(--surface-border-strong)", padding: "1.25rem", zIndex: "270", boxShadow: "0 20px 48px rgba(0,0,0,0.35)", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <div style={{ textAlign: "center" }}>
              <span className="security-badge-header">[ 2FA // VERIFICATION ]</span>
            </div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#090d16", textAlign: "center" }}>
              Verify Profile Changes
            </h3>
            
            {!otpSent ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: "1.45", textAlign: "center" }}>
                  Select where you want to receive your 4-digit verification OTP code to confirm profile edits:
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.65rem 0.85rem", border: "1px solid var(--surface-border)", borderRadius: "4px", background: otpChannel === "mobile" ? "rgba(16,185,129,0.08)" : "rgba(0,0,0,0.02)", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="otpChannel"
                      value="mobile"
                      checked={otpChannel === "mobile"}
                      onChange={() => setOtpChannel("mobile")}
                    />
                    <div style={{ fontSize: "0.78rem" }}>
                      <strong>Mobile Number</strong>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>{userProfile.phone}</div>
                    </div>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.65rem 0.85rem", border: "1px solid var(--surface-border)", borderRadius: "4px", background: otpChannel === "email" ? "rgba(16,185,129,0.08)" : "rgba(0,0,0,0.02)", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="otpChannel"
                      value="email"
                      checked={otpChannel === "email"}
                      onChange={() => setOtpChannel("email")}
                    />
                    <div style={{ fontSize: "0.78rem" }}>
                      <strong>Company Email</strong>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>{userProfile.email}</div>
                    </div>
                  </label>
                </div>

                <button
                  type="button"
                  className="btn-hero-primary"
                  onClick={handleSendProfileOTP}
                >
                  Send Verification OTP
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: "1.45", textAlign: "center" }}>
                  Enter the 4-digit code sent to your <strong>{otpChannel === "mobile" ? userProfile.phone : userProfile.email}</strong>:
                </p>

                {/* 4-DIGIT SQUARES IN A HORIZONTAL ROW */}
                <div className="security-otp-box" style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "0.6rem" }}>
                  {otpInput.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`profile-otp-${idx}`}
                      type="text"
                      maxLength="1"
                      className="security-otp-input"
                      style={{ width: "44px", height: "48px", minWidth: "44px", flex: "0 0 44px", textAlign: "center" }}
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value;
                        const newOtp = [...otpInput];
                        newOtp[idx] = val;
                        setOtpInput(newOtp);
                        if (val && idx < 3) {
                          const nextInput = document.getElementById(`profile-otp-${idx + 1}`);
                          if (nextInput) nextInput.focus();
                        }
                      }}
                    />
                  ))}
                </div>

                <div style={{ textAlign: "center", fontSize: "0.72rem", color: "#059669", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                  [ DEMO OTP: 1234 ]
                </div>

                <button
                  type="button"
                  className="btn-hero-primary"
                  onClick={handleVerifyProfileOTP}
                >
                  Verify &amp; Save Details
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ACCOUNT DELETED NOTIFICATION BANNER */}
      {accountDeletedNotice && (
        <div style={{ background: "#dc2626", color: "#ffffff", padding: "0.75rem 1rem", textAlign: "center", fontSize: "0.78rem", fontWeight: "800", fontFamily: "var(--font-mono)" }}>
          Account and all call recording data have been permanently deleted.
        </div>
      )}

      {/* SYNC NOTIFICATION BANNER */}
      {syncNotice && (
        <div style={{ background: "#090d16", color: "#ffffff", padding: "0.75rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: "600" }}>
            Synced call from {syncNotice.name} — Lead created
          </span>
          <span style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: "0.68rem", padding: "0.2rem 0.5rem", borderRadius: "2px", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
            SYNCED
          </span>
        </div>
      )}

      {/* SETTINGS SAVED TOAST */}
      {settingsSavedToast && (
        <div style={{ position: "absolute", top: "65px", left: "50%", transform: "translateX(-50%)", background: "#090d16", color: "#10b981", border: "1px solid rgba(16,185,129,0.4)", padding: "0.45rem 1rem", borderRadius: "4px", fontFamily: "var(--font-mono)", fontWeight: "700", fontSize: "0.75rem", zIndex: "200", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
          ✓ SETTINGS_SAVED_OK
        </div>
      )}

      {/* MODAL FOR DELETE ACCOUNT CONFIRMATION */}
      {deleteAccountModalOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setDeleteAccountModalOpen(false)} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "90%", maxWidth: "340px", background: "#ffffff", borderRadius: "6px", border: "1px solid var(--surface-border-strong)", padding: "1.25rem", zIndex: "260", boxShadow: "0 20px 48px rgba(0,0,0,0.35)", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ color: "#dc2626", fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: "800", background: "rgba(220,38,38,0.1)", padding: "0.25rem 0.6rem", borderRadius: "3px" }}>
                [ WARNING // PERMANENT ACTION ]
              </span>
            </div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "900", color: "#dc2626", textAlign: "center" }}>
              Delete Account &amp; Purge Data?
            </h3>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: "1.45", textAlign: "center" }}>
              Are you sure you want to permanently delete your AI Call CRM account? All call audio recordings, contacts, and lead profiles will be erased. <strong>This action CANNOT be undone.</strong>
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.4rem" }}>
              <button
                type="button"
                className="btn-delete-account"
                onClick={handleConfirmDeleteAccount}
              >
                Permanently Delete Account
              </button>
              <button
                type="button"
                className="btn-hero-secondary"
                onClick={() => setDeleteAccountModalOpen(false)}
                style={{ justifyContent: "center" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* MODAL FOR 1-TAP AI CALL SUMMARY PREVIEW */}
      {summaryModalLead && (
        <>
          <div className="drawer-backdrop" onClick={() => setSummaryModalLead(null)} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "90%", maxWidth: "360px", background: "#ffffff", borderRadius: "6px", border: "1px solid var(--surface-border-strong)", padding: "1.25rem", zIndex: "250", boxShadow: "0 20px 48px rgba(0,0,0,0.35)", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--surface-border)", paddingBottom: "0.45rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "1px", background: "#10b981", display: "inline-block" }}></span>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#090d16" }}>AI Call Summary</h3>
              </div>
              <button type="button" onClick={() => setSummaryModalLead(null)} style={{ border: "none", background: "none", fontSize: "1rem", fontWeight: "800", cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>
            <div>
              <strong style={{ fontSize: "0.92rem", color: "#090d16" }}>{summaryModalLead.name}</strong>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{summaryModalLead.company} • {summaryModalLead.phone}</div>
            </div>
            <div className="ai-summary-box" style={{ margin: 0 }}>
              <div className="ai-box-label">[ SPECIMEN // AUDIO_NOTE ]</div>
              <p className="ai-box-text">
                {summaryModalLead.notes[0] || "AI processed call audio automatically. Quote request and spec verified."}
              </p>
            </div>
            <a href={`sms:${summaryModalLead.phone}`} className="btn-hero-primary" style={{ justifyContent: "center", padding: "0.55rem" }}>
              Send Mobile SMS
            </a>
          </div>
        </>
      )}

      {/* SCROLLABLE MOBILE CONTENT AREA WITH LENIS SMOOTH MOMENTUM SCROLL */}
      <div className="mobile-content-body">
        {/* MOBILE APP LOGIN SCREEN (Shown if !isLoggedIn) */}
        {!isLoggedIn ? (
          <main style={{ display: "flex", flexDirection: "column", gap: "1.2rem", margin: "auto 0" }}>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.45rem" }}>
              <BrandMark />
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#090d16", letterSpacing: "-0.03em" }}>
                AI Call CRM
              </h2>
              <div className="security-badge-header">
                [ SYS // WORKSPACE ACCESS ]
              </div>
              <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", maxWidth: "340px", margin: "0.1rem auto 0" }}>
                Instant AI call summaries &amp; task checklists for all types of users — sales reps, freelancers, consultants, brokers &amp; businesses.
              </p>
            </div>

            <div className="auth-card-container">
              <div style={{ textAlign: "center", paddingBottom: "0.4rem", borderBottom: "1px solid var(--surface-border)" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#090d16" }}>
                  Company Log In
                </h3>
                <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                  Sign in with your Company ID to access call recordings, AI summaries, and leads.
                </p>
              </div>

              {/* SECURITY ERROR DISPLAY FOR INCORRECT ID / PASSWORD */}
              {authError && (
                <div className="security-lockout-banner">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div className="auth-input-group">
                  <label className="auth-input-label">Company Registration ID</label>
                  <input
                    type="text"
                    className="auth-text-input"
                    placeholder="e.g. CALL-240001 or CMP-84920"
                    value={loginCompanyId}
                    onChange={(e) => setLoginCompanyId(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <label className="auth-input-label">Your Password</label>
                  <div className="auth-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="auth-text-input"
                      placeholder="Enter password..."
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-hero-primary"
                  style={{ marginTop: "0.3rem" }}
                >
                  Log In to Mobile CRM
                </button>

                <div style={{ background: "#f8fafc", border: "1px solid rgba(15,23,42,0.1)", borderRadius: "4px", padding: "0.75rem", textAlign: "center", fontSize: "0.72rem", color: "#475569", lineHeight: "1.45", marginTop: "0.2rem" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: "700", color: "#090d16", display: "block", marginBottom: "0.2rem" }}>[ NOTICE // COMPANY_REGISTRATION ]</span>
                  New company onboarding is provisioned exclusively on our website portal.
                  <br />
                  <span style={{ color: "#090d16", fontWeight: "700" }}>
                    Register on the website to receive your instant Company ID.
                  </span>
                </div>

                <button
                  type="button"
                  className="btn-hero-secondary"
                  onClick={() => completeLogin("CMP-84920")}
                  style={{ fontSize: "0.78rem", padding: "0.6rem" }}
                >
                  Quick Demo Login (CMP-84920)
                </button>
              </form>
            </div>
          </main>
        ) : (
          <>
            {/* VIEW 0: HOME PAGE / LANDING PAGE */}
            {currentView === "landing" && (
              <main className="mobile-hero">
                <div className="hero-pill-badge">
                  <span className="badge-dot"></span>
                  <span>AI Call CRM • Automated Workspace</span>
                </div>

                <h1 className="landing-headline">
                  Instant AI call summaries for every conversation &amp; user.
                </h1>

                <p className="landing-subheadline">
                  Built for all types of users — sales closers, freelancers, business owners, consultants, real estate brokers, and field teams. The second your phone call finishes, AI automatically creates a 2-line summary, action checklist, and 1-tap follow-up SMS.
                </p>

                {/* ABOVE-THE-FOLD 4-PILLAR VALUE MATRIX */}
                <div className="hero-pillars-grid">
                  <div className="hero-pillar-cell">
                    <span className="hero-pillar-label">WHAT IT IS</span>
                    <span className="hero-pillar-text">Instant AI call summarizer, audio transcription &amp; task checklist engine</span>
                  </div>
                  <div className="hero-pillar-cell">
                    <span className="hero-pillar-label">WHO IT IS FOR</span>
                    <span className="hero-pillar-text">All users: Sales, freelancers, brokers, consultants, field teams &amp; businesses</span>
                  </div>
                  <div className="hero-pillar-cell">
                    <span className="hero-pillar-label">WHY IT MATTERS</span>
                    <span className="hero-pillar-text">Never lose spoken deal details • Instant 1-tap client follow-up SMS</span>
                  </div>
                </div>

                <div className="landing-cta-row">
                  <button
                    type="button"
                    className="btn-hero-primary"
                    onClick={() => setCurrentView("pipeline")}
                  >
                    View Lead Pipeline
                  </button>
                  <button
                    type="button"
                    className="btn-hero-secondary"
                    onClick={handleTriggerSync}
                  >
                    Sync Mobile Call Audio
                  </button>
                  <span className="hero-next-step-hint">
                    NEXT: Explore active pipeline leads or sync a simulated call
                  </span>
                </div>

                {/* Mobile Feature Highlights */}
                <div className="mobile-features-grid" style={{ width: "100%", marginTop: "1rem" }}>
                  <div className="feature-card">
                    <div className="feature-icon-box">
                      <IconCallLab />
                    </div>
                    <h3 className="feature-card-title">Auto-Sync Recordings</h3>
                    <p className="feature-card-desc">
                      Listens when phone calls end on mobile devices and automatically retrieves call audio for instant AI processing.
                    </p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon-box">
                      <IconPipeline />
                    </div>
                    <h3 className="feature-card-title">Automated Lead CRM</h3>
                    <p className="feature-card-desc">
                      Auto-creates caller profiles, phone contacts, email records, and assigns sentiment intent badges automatically.
                    </p>
                  </div>
                </div>
              </main>
            )}

            {/* DEDICATED VIEW: COMPANY PROFILE & ACCOUNT PAGE */}
            {currentView === "profile" && (
              <main style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: "800" }}>Company Profile</h2>
                  <button
                    type="button"
                    className="btn-back-link"
                    onClick={() => setCurrentView("landing")}
                  >
                    Back Home
                  </button>
                </div>

                {profileSavedToast && (
                  <div style={{ background: "#090d16", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)", padding: "0.55rem 1rem", borderRadius: "4px", fontFamily: "var(--font-mono)", fontWeight: "700", fontSize: "0.75rem", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}>
                    PROFILE_DETAILS_VERIFIED_OK
                  </div>
                )}

                <div className="panel-box">
                  <div className="panel-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div className="user-profile-btn" style={{ width: "32px", height: "32px" }}>
                        {companyInitials}
                      </div>
                      <div>
                        <h3 style={{ fontSize: "0.95rem" }}>{userProfile.companyName}</h3>
                        <span style={{ fontSize: "0.7rem", color: "var(--brand-olive-dark)", fontWeight: "800" }}>
                          ID: {userProfile.companyId}
                        </span>
                      </div>
                    </div>

                    {!isEditingProfile && (
                      <button
                        type="button"
                        className="btn-black-pill"
                        onClick={() => setIsEditingProfile(true)}
                      >
                        Edit Details
                      </button>
                    )}
                  </div>

                  {!isEditingProfile ? (
                    /* READ-ONLY VIEW OF COMPANY PROFILE DETAILS */
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                      <div style={{ padding: "0.6rem 0.8rem", background: "#ffffff", border: "1px solid var(--surface-border-strong)", borderRadius: "4px" }}>
                        <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "var(--text-subtle)", textTransform: "uppercase", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
                          Business / Company Name
                        </span>
                        <div style={{ fontSize: "0.9rem", fontWeight: "800", color: "#090d16", marginTop: "0.1rem" }}>
                          {userProfile.companyName}
                        </div>
                      </div>

                      <div style={{ padding: "0.6rem 0.8rem", background: "#ffffff", border: "1px solid var(--surface-border-strong)", borderRadius: "4px" }}>
                        <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "var(--text-subtle)", textTransform: "uppercase", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
                          Registered Phone Number
                        </span>
                        <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#090d16", marginTop: "0.1rem", fontFamily: "var(--font-mono)" }}>
                          {userProfile.phone}
                        </div>
                      </div>

                      <div style={{ padding: "0.6rem 0.8rem", background: "#ffffff", border: "1px solid var(--surface-border-strong)", borderRadius: "4px" }}>
                        <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "var(--text-subtle)", textTransform: "uppercase", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
                          Company Email Address
                        </span>
                        <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#090d16", marginTop: "0.1rem", fontFamily: "var(--font-mono)" }}>
                          {userProfile.email}
                        </div>
                      </div>

                      <div style={{ padding: "0.6rem 0.8rem", background: "#ffffff", border: "1px solid var(--surface-border-strong)", borderRadius: "4px" }}>
                        <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "var(--text-subtle)", textTransform: "uppercase", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
                          Business Address
                        </span>
                        <div style={{ fontSize: "0.82rem", fontWeight: "600", color: "#090d16", marginTop: "0.1rem" }}>
                          {userProfile.address || "Standard Industrial Zone"}
                        </div>
                      </div>

                      <div style={{ padding: "0.65rem 0.85rem", background: "rgba(2,132,199,0.06)", border: "1px solid rgba(2,132,199,0.2)", borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#0284c7", fontFamily: "var(--font-mono)" }}>Website Registration ID:</span>
                        <strong style={{ fontSize: "0.88rem", color: "#0284c7", fontFamily: "var(--font-mono)", fontWeight: "800" }}>{userProfile.companyId}</strong>
                      </div>

                      <button
                        type="button"
                        className="btn-hero-primary"
                        style={{ marginTop: "0.3rem" }}
                        onClick={() => setIsEditingProfile(true)}
                      >
                        Edit Company Details
                      </button>

                      <button
                        type="button"
                        className="btn-hero-secondary"
                        style={{ color: "#dc2626", borderColor: "#fca5a5", justifyContent: "center" }}
                        onClick={handleLogout}
                      >
                        Log Out of App
                      </button>
                    </div>
                  ) : (
                    /* EDIT MODE FORM - SLEEK PROPORTIONAL PILL BUTTONS */
                    <form onSubmit={handleInitiateProfileSave} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div className="auth-input-group">
                        <label className="auth-input-label">Company / Business Name</label>
                        <input
                          type="text"
                          className="auth-text-input"
                          value={draftProfile.companyName}
                          onChange={(e) => setDraftProfile({ ...draftProfile, companyName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="auth-input-group">
                        <label className="auth-input-label">Registered Phone Number</label>
                        <input
                          type="text"
                          className="auth-text-input"
                          value={draftProfile.phone}
                          onChange={(e) => setDraftProfile({ ...draftProfile, phone: e.target.value })}
                          required
                        />
                      </div>

                      <div className="auth-input-group">
                        <label className="auth-input-label">Company Email Address</label>
                        <input
                          type="email"
                          className="auth-text-input"
                          value={draftProfile.email}
                          onChange={(e) => setDraftProfile({ ...draftProfile, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="auth-input-group">
                        <label className="auth-input-label">Business Address / Location</label>
                        <input
                          type="text"
                          className="auth-text-input"
                          value={draftProfile.address}
                          onChange={(e) => setDraftProfile({ ...draftProfile, address: e.target.value })}
                        />
                      </div>

                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem", alignItems: "center" }}>
                        <button
                          type="submit"
                          className="btn-hero-primary"
                          style={{ flex: "1 1 auto", minHeight: "36px", padding: "0.5rem 0.75rem", fontSize: "0.76rem" }}
                        >
                          Save Changes (OTP)
                        </button>

                        <button
                          type="button"
                          className="btn-hero-secondary"
                          style={{ flex: "0 0 auto", minHeight: "36px", padding: "0.5rem 0.9rem", fontSize: "0.76rem" }}
                          onClick={() => setIsEditingProfile(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </main>
            )}

            {/* VIEW 1: UNIVERSAL DEEP SEARCH PAGE (SEARCHES CONTACTS, TRANSCRIPTS, NOTES & APP SETTINGS) */}
            {currentView === "search" && (
              <main style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "800" }}>🔍 Universal Deep Search</h2>

                <div className="universal-search-wrap">
                  <span className="search-input-icon"><IconSearch /></span>
                  <input
                    type="text"
                    className="universal-search-input"
                    placeholder="Search names, phone #, AI notes, spoken words, or app settings..."
                    value={universalSearchQuery}
                    onChange={(e) => setUniversalSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {universalSearchQuery && (
                    <button
                      type="button"
                      className="search-clear-btn"
                      onClick={() => setUniversalSearchQuery("")}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {!universalSearchQuery && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--text-muted)" }}>Suggested Search Terms:</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {["Security", "Delete Account", "Ollama", "Export CSV", "SMS Template", "Storage Path", "Auto-Sync", "Valves"].map((term) => (
                        <button
                          key={term}
                          type="button"
                          className="pipeline-tab-pill"
                          onClick={() => setUniversalSearchQuery(term)}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {universalSearchQuery && (
                  <div style={{ fontSize: "0.78rem", fontWeight: "800", color: "var(--brand-olive-dark)" }}>
                    Found {searchResults.length} matches for "{universalSearchQuery}"
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {searchResults.map((res, i) => (
                    <div
                      key={i}
                      className="pipeline-lead-card-clean"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (res.type === "contact") {
                          setActiveContact(res.leadObj);
                          setCurrentView("recordings");
                          setLeadsSubView("contact_leads");
                        } else if (res.type === "call") {
                          setActiveLeadCall(res.callObj);
                          setCurrentView("recordings");
                          setLeadsSubView("lead_detail");
                        } else if (res.type === "setting") {
                          setCurrentView("settings");
                        }
                      }}
                    >
                      <div className="clean-card-header">
                        <strong style={{ fontSize: "0.92rem" }}>{res.title}</strong>
                        <span className={`search-match-badge ${res.matchType.includes("Settings") ? "match-setting" : res.matchType.includes("Spoken") ? "match-transcript" : res.matchType.includes("Contact") ? "match-contact" : "match-summary"}`}>
                          {res.matchType}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>{res.subtitle}</div>
                      <div className="clean-deal-tag">
                        <span>{res.snippet}</span>
                      </div>
                      <div style={{ textAlign: "right", fontSize: "0.72rem", color: "var(--brand-olive)", fontWeight: "800" }}>
                        {res.type === "setting" ? "Open Setting Option →" : "View Full Details →"}
                      </div>
                    </div>
                  ))}

                  {universalSearchQuery && searchResults.length === 0 && (
                    <div className="panel-box" style={{ textAlign: "center", padding: "2rem 1rem" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: "800", color: "#64748b" }}>[ 00 // NO_MATCHING_RECORDS ]</div>
                      <h3 style={{ fontSize: "1rem", fontWeight: "800", marginTop: "0.4rem" }}>No matching results</h3>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        No call notes, contact names, spoken transcript words, or app settings options matched "{universalSearchQuery}".
                      </p>
                    </div>
                  )}
                </div>
              </main>
            )}

            {/* VIEW 2: CONTACTS & LEADS PAGE (3-LEVEL DRILL-DOWN FLOW) */}
            {currentView === "recordings" && (
              <main style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                {leadsSubView === "contacts" && (
                  <div className="panel-box">
                    <div className="panel-header">
                      <h3>Contacts ({filteredLeads.length})</h3>
                      <input
                        type="text"
                        placeholder="Search contact..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        style={{ padding: "0.35rem 0.65rem", borderRadius: "4px", border: "1px solid var(--surface-border-strong)", fontSize: "0.75rem", fontFamily: "var(--font-mono)", width: "130px" }}
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                      {filteredLeads.map((contact) => (
                        <div
                          key={contact.id}
                          className="contact-name-row"
                          onClick={() => {
                            setActiveContact(contact);
                            setLeadsSubView("contact_leads");
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                            <div className="avatar-initial">
                              {contact.name.charAt(0)}
                            </div>
                            <div>
                              <div className="contact-name-title">{contact.name}</div>
                              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{contact.company}</div>
                            </div>
                          </div>
                          <span className="contact-chevron">→</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {leadsSubView === "contact_leads" && activeContact && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="drilldown-bar">
                      <button
                        type="button"
                        className="btn-back-link"
                        onClick={() => setLeadsSubView("contacts")}
                      >
                        Contacts
                      </button>
                      <div>
                        <h3 style={{ fontSize: "1rem", fontWeight: "800" }}>{activeContact.name}</h3>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                          {activeContact.company} • {activeContact.phone}
                        </div>
                      </div>
                    </div>

                    <div className="panel-box">
                      <div className="panel-header">
                        <h3>Call Leads &amp; Audio Sessions</h3>
                        <span className="ind-pill ind-manufacturing">
                          {getCallsForContact(activeContact).length} Calls
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {getCallsForContact(activeContact).map((call) => (
                          <div
                            key={call.id}
                            className="contact-lead-item"
                            onClick={() => {
                              setActiveLeadCall(call);
                              setLeadsSubView("lead_detail");
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <div className="lead-title-text">{call.title}</div>
                              <span style={{ fontSize: "0.68rem", background: "rgba(16,185,129,0.12)", color: "#059669", padding: "0.2rem 0.5rem", borderRadius: "2px", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                                {call.sentiment}
                              </span>
                            </div>
                            <p className="lead-snippet-text">{call.summary}</p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem", color: "var(--text-subtle)", marginTop: "0.2rem" }}>
                              <span style={{ fontFamily: "var(--font-mono)" }}>{call.duration}</span>
                              <span style={{ fontWeight: "700", color: "#0284c7", fontFamily: "var(--font-mono)" }}>VIEW_AI_AUDIO →</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {leadsSubView === "lead_detail" && activeLeadCall && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="drilldown-bar">
                      <button
                        type="button"
                        className="btn-back-link"
                        onClick={() => setLeadsSubView("contact_leads")}
                      >
                        All Leads
                      </button>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <h3 style={{ fontSize: "0.95rem", fontWeight: "800" }}>{activeLeadCall.title}</h3>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{activeLeadCall.client}</div>
                      </div>
                    </div>

                    <div className="panel-box dark-panel-box">
                      <div className="panel-header">
                        <div>
                          <h3 style={{ color: "#ffffff" }}>{activeLeadCall.title}</h3>
                          <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontFamily: "var(--font-mono)" }}>{activeLeadCall.client}</div>
                        </div>
                        <span style={{ padding: "0.2rem 0.5rem", background: "rgba(16,185,129,0.15)", color: "#10b981", borderRadius: "2px", fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: "700" }}>
                          {activeLeadCall.sentiment}
                        </span>
                      </div>

                      <div className="audio-player-card">
                        <div className="waveform-wrap">
                          {activeLeadCall.waveform.map((h, i) => {
                            const isPlayed = (i / activeLeadCall.waveform.length) <= (currentTime / duration);
                            return (
                              <div
                                key={i}
                                className={`wave-bar ${isPlayed ? "played" : ""}`}
                                style={{ height: `${h}%` }}
                              />
                            );
                          })}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <button
                            type="button"
                            className="btn-play-pause"
                            onClick={() => setIsPlaying(!isPlaying)}
                            aria-label={isPlaying ? "Pause" : "Play"}
                          >
                            {isPlaying ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                            )}
                          </button>
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                            <input
                              type="range"
                              min="0"
                              max={duration}
                              value={currentTime}
                              onChange={(e) => setCurrentTime(Number(e.target.value))}
                              style={{ accentColor: "#10b981", cursor: "pointer" }}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#9ca3af", fontFamily: "var(--font-mono)" }}>
                              <span>{formatTime(currentTime)}</span>
                              <span>{activeLeadCall.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {aiResult && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                          <div className="ai-summary-box">
                            <div className="ai-box-label">[ SPECIMEN // EXECUTIVE_SUMMARY ]</div>
                            <p className="ai-box-text">{aiResult.summary}</p>
                          </div>

                          <div>
                            <div className="ai-box-label" style={{ marginBottom: "0.35rem" }}>[ ACTION // CHECKLIST ]</div>
                            <div className="checklist-area">
                              {aiResult.actionItems.map((item, i) => (
                                <div key={i} className="checklist-item">
                                  <input type="checkbox" defaultChecked />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
                            <a
                              href={`sms:${activeContact?.phone || "+919823044120"}`}
                              className="btn-black-pill btn-sms-pill"
                              style={{ width: "100%", justifyContent: "center", padding: "0.65rem" }}
                            >
                              Send SMS to Contact
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </main>
            )}

            {/* VIEW 3: PIPELINE */}
            {currentView === "pipeline" && (
              <main style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: "800" }}>Lead Pipeline</h2>
                  <span style={{ fontSize: "0.68rem", background: "rgba(2,132,199,0.1)", color: "#0284c7", padding: "0.2rem 0.5rem", borderRadius: "2px", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                    [ {pipelineLeads.length}_LEADS ]
                  </span>
                </div>

                <div className="pipeline-tabs-row">
                  {["All", "New", "Warm", "Proposal", "Closed"].map((stage) => {
                    const count = stage === "All" ? leads.length : leads.filter(l => l.status === stage).length;
                    return (
                      <button
                        key={stage}
                        type="button"
                        className={`pipeline-tab-pill ${pipelineFilter === stage ? "active" : ""}`}
                        onClick={() => setPipelineFilter(stage)}
                      >
                        {stage} ({count})
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {pipelineLeads.map((lead) => (
                    <div key={lead.id} className="pipeline-lead-card-clean">
                      <div className="clean-card-header">
                        <div className="clean-contact-info">
                          <div className="avatar-initial">
                            {lead.name.charAt(0)}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div className="contact-name-text">{lead.name}</div>
                            <div className="contact-company-text">{lead.company} • {lead.phone}</div>
                          </div>
                        </div>

                        <select
                          className="stage-select-compact"
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="Warm">Warm</option>
                          <option value="Proposal">Proposal</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>

                      <div className="clean-deal-tag">
                        <span>{lead.notes[0] || "AI processed call audio automatically."}</span>
                      </div>

                      <div className="clean-card-actions">
                        <span className={`ind-pill ind-${lead.industry}`}>
                          {lead.industry.toUpperCase()}
                        </span>

                        <div style={{ display: "flex", gap: "0.35rem" }}>
                          <a href={`sms:${lead.phone}`} className="btn-mini-action btn-mini-sms">
                            SMS
                          </a>
                          <button
                            type="button"
                            className="btn-mini-action btn-mini-note"
                            onClick={() => setSummaryModalLead(lead)}
                          >
                            AI Note
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </main>
            )}

            {/* VIEW 4: DASHBOARD */}
            {currentView === "dashboard" && (
              <main style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: "800" }}>Analytics &amp; Metrics</h2>
                  <span style={{ fontSize: "0.68rem", background: "rgba(16,185,129,0.12)", color: "#059669", padding: "0.2rem 0.5rem", borderRadius: "2px", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                    [ SYS // LIVE_ENGINE ]
                  </span>
                </div>

                <div className="analytics-grid-2col">
                  <div className="stat-card-widget">
                    <span className="stat-widget-label">Calls Synced</span>
                    <div className="stat-widget-number">42</div>
                    <span className="stat-widget-trend">↗ +14% this week</span>
                  </div>

                  <div className="stat-card-widget">
                    <span className="stat-widget-label">AI Summaries</span>
                    <div className="stat-widget-number">128</div>
                    <span className="stat-widget-trend">100% Automated</span>
                  </div>

                  <div className="stat-card-widget">
                    <span className="stat-widget-label">Active Leads</span>
                    <div className="stat-widget-number">{leads.length}</div>
                    <span className="stat-widget-trend">68% Qualified</span>
                  </div>

                  <div className="stat-card-widget">
                    <span className="stat-widget-label">Avg Processing</span>
                    <div className="stat-widget-number">0.4s</div>
                    <span className="stat-widget-trend">Smart AI Engine</span>
                  </div>
                </div>

                <div className="panel-box">
                  <div className="panel-header">
                    <h3>Call Intent &amp; Urgency Breakdown</h3>
                    <span style={{ fontSize: "0.72rem", fontWeight: "800", color: "var(--brand-olive)" }}>100% Synced</span>
                  </div>

                  <div className="sentiment-bar-track">
                    <div className="sentiment-bar-segment high" style={{ width: "50%" }}></div>
                    <div className="sentiment-bar-segment warm" style={{ width: "35%" }}></div>
                    <div className="sentiment-bar-segment info" style={{ width: "15%" }}></div>
                  </div>

                  <div className="sentiment-legend-row">
                    <div><span className="legend-item-dot" style={{ background: "#84cc16" }}></span>High Priority (50%)</div>
                    <div><span className="legend-item-dot" style={{ background: "#3b82f6" }}></span>Warm (35%)</div>
                    <div><span className="legend-item-dot" style={{ background: "#f59e0b" }}></span>Info (15%)</div>
                  </div>
                </div>
              </main>
            )}

            {/* VIEW 5: ESSENTIAL & PRACTICAL APP SETTINGS PAGE */}
            {currentView === "settings" && (
              <main style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: "800" }}>App Settings</h2>
                  <button
                    type="button"
                    className="btn-black-pill"
                    onClick={handleSaveSettings}
                  >
                    Save
                  </button>
                </div>

                {/* Section 0: Encrypted User Profile & Token Info */}
                {userProfile && (
                  <div className="panel-box" style={{ background: "#111111", color: "#ffffff" }}>
                    <div className="panel-header" style={{ borderBottomColor: "rgba(255,255,255,0.1)" }}>
                      <h3 style={{ color: "#ffffff" }}>Encrypted Company Session</h3>
                      <button
                        type="button"
                        onClick={handleLogout}
                        style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "3px", padding: "0.25rem 0.6rem", fontSize: "0.68rem", fontFamily: "var(--font-mono)", fontWeight: "700", cursor: "pointer" }}
                      >
                        LOG OUT
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <strong style={{ fontSize: "1rem", color: "#10b981" }}>{userProfile.companyName}</strong>
                          <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontFamily: "var(--font-mono)" }}>TEL: {userProfile.phone}</div>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", padding: "0.3rem 0.65rem", borderRadius: "3px", fontFamily: "var(--font-mono)", fontSize: "0.82rem", fontWeight: "800", color: "#10b981" }}>
                          ID: {userProfile.companyId}
                        </div>
                      </div>

                      <div style={{ marginTop: "0.2rem", padding: "0.45rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "3px", fontSize: "0.68rem", color: "#94a3b8", fontFamily: "var(--font-mono)" }}>
                        TOKEN: {userProfile.sessionToken.substring(0, 32)}...
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 1: Security Controls (Biometric) */}
                <div className="panel-box">
                  <div className="panel-header">
                    <h3>Security Controls</h3>
                    <span style={{ fontSize: "0.64rem", background: "rgba(16,185,129,0.12)", color: "#059669", padding: "0.18rem 0.5rem", borderRadius: "2px", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                      [ ENCRYPTED ]
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div className="setting-row-toggle">
                      <div className="setting-label-group">
                        <span className="setting-title">Android Biometric / Fingerprint Lock</span>
                        <span className="setting-desc">Require device biometric verification to open CRM</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={enableBiometric}
                          onChange={(e) => setEnableBiometric(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Android System Permissions & On-Device Privacy Storage */}
                <div className="panel-box">
                  <div className="panel-header">
                    <div>
                      <h3>Android Permissions &amp; Storage</h3>
                      <div style={{ fontSize: "0.68rem", color: "#64748b", marginTop: "0.15rem" }}>
                        All notes &amp; summaries stored locally on your device
                      </div>
                    </div>
                    <span style={{ fontSize: "0.62rem", background: "rgba(16,185,129,0.12)", color: "#059669", padding: "0.2rem 0.5rem", borderRadius: "3px", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                      [ 100% PRIVATE ]
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ padding: "0.65rem", background: "#f8fafc", border: "1px solid var(--surface-border-strong)", borderRadius: "4px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                        <span style={{ fontSize: "0.74rem", fontWeight: "700", color: "#090d16" }}>💾 On-Device Local Storage</span>
                        <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "#10b981", fontWeight: "700" }}>ACTIVE • ZERO CLOUD DB</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.7rem", color: "#64748b", lineHeight: "1.3" }}>
                        Your call summaries, notes, and contacts are stored strictly in your phone&apos;s storage ({leads.length} contacts saved). Nothing is saved to any public cloud database.
                      </p>
                    </div>

                    {ANDROID_PERMISSIONS.map((perm) => (
                      <div key={perm.id} className="setting-row-toggle">
                        <div className="setting-label-group">
                          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                            <span className="setting-title">{perm.name}</span>
                            <span style={{ fontSize: "0.58rem", fontFamily: "var(--font-mono)", padding: "0.1rem 0.35rem", borderRadius: "2px", background: androidPermissions[perm.id] ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: androidPermissions[perm.id] ? "#059669" : "#dc2626", fontWeight: "700" }}>
                              {androidPermissions[perm.id] ? "GRANTED" : "DISABLED"}
                            </span>
                          </div>
                          <span className="setting-desc">{perm.description}</span>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={Boolean(androidPermissions[perm.id])}
                            onChange={() => togglePermission(perm.id)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Mobile Call Recording Storage & Sync Settings */}
                <div className="panel-box">
                  <div className="panel-header">
                    <h3>Mobile Recording &amp; Sync</h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div className="setting-row-toggle">
                      <div className="setting-label-group">
                        <span className="setting-title">Auto-Sync Calls on Hang-Up</span>
                        <span className="setting-desc">Automatically fetch call audio when a call finishes</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={autoSyncCalls}
                          onChange={(e) => setAutoSyncCalls(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-row-toggle">
                      <div className="setting-label-group">
                        <span className="setting-title">Filter Out Short Calls (&lt; 10s)</span>
                        <span className="setting-desc">Ignore missed calls or wrong numbers</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={skipShortCalls}
                          onChange={(e) => setSkipShortCalls(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div>
                      <label className="setting-title" style={{ display: "block", marginBottom: "0.3rem" }}>Device Call Recording Storage Path</label>
                      <input
                        type="text"
                        className="setting-select-input"
                        value={recordingStoragePath}
                        onChange={(e) => setRecordingStoragePath(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: AI Summarizer & Clipboard Settings */}
                <div className="panel-box">
                  <div className="panel-header">
                    <h3>AI Call Engine Settings</h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div>
                      <label className="setting-title" style={{ display: "block", marginBottom: "0.3rem" }}>AI Processing Provider</label>
                      <select
                        className="setting-select-input"
                        value={aiProvider}
                        onChange={(e) => setAiProvider(e.target.value)}
                      >
                        <option value="builtin">Built-in Smart AI (Instant - FREE)</option>
                        <option value="openai">OpenAI GPT-4o / Gemini (Cloud API Key)</option>
                        <option value="ollama">Local Server Host</option>
                      </select>
                    </div>

                    {aiProvider === "openai" && (
                      <div>
                        <label className="setting-title" style={{ display: "block", marginBottom: "0.3rem" }}>API Key</label>
                        <input
                          type="password"
                          className="setting-select-input"
                          placeholder="sk-..."
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="setting-row-toggle">
                      <div className="setting-label-group">
                        <span className="setting-title">Auto-Generate Call Notes</span>
                        <span className="setting-desc">Process recording audio into CRM leads instantly</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={autoSummarize}
                          onChange={(e) => setAutoSummarize(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-row-toggle">
                      <div className="setting-label-group">
                        <span className="setting-title">Auto-Copy Summary to Clipboard</span>
                        <span className="setting-desc">Copy AI call note automatically for easy sharing</span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={autoCopyClipboard}
                          onChange={(e) => setAutoCopyClipboard(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Section 4: SMS Follow-up Template Manager */}
                <div className="panel-box">
                  <div className="panel-header">
                    <h3>Quick SMS Template</h3>
                  </div>

                  <div>
                    <label className="setting-title" style={{ display: "block", marginBottom: "0.3rem" }}>Default SMS Follow-up Message</label>
                    <textarea
                      className="setting-textarea-input"
                      value={smsTemplate}
                      onChange={(e) => setSmsTemplate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Section 5: Data Export */}
                <div className="panel-box">
                  <div className="panel-header">
                    <h3>Data Backup &amp; Export</h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                    <button
                      type="button"
                      className="btn-hero-secondary"
                      onClick={handleExportCSV}
                      style={{ justifyContent: "center", padding: "0.65rem", fontSize: "0.8rem" }}
                    >
                      Export All CRM Leads to CSV
                    </button>

                    <button
                      type="button"
                      onClick={handleResetData}
                      style={{ background: "#f8fafc", color: "#090d16", border: "1px solid var(--surface-border-strong)", borderRadius: "4px", padding: "0.65rem", fontFamily: "var(--font-sans)", fontWeight: "600", fontSize: "0.8rem", cursor: "pointer" }}
                    >
                      Reset CRM Sample Data
                    </button>
                  </div>
                </div>

                {/* Section 6: Danger Zone - Delete Account */}
                <div className="danger-panel-box">
                  <div className="panel-header" style={{ borderBottomColor: "rgba(239,68,68,0.2)" }}>
                    <h3 style={{ color: "#dc2626" }}>Danger Zone</h3>
                    <span style={{ fontSize: "0.64rem", background: "rgba(220,38,38,0.12)", color: "#dc2626", padding: "0.18rem 0.5rem", borderRadius: "2px", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                      [ PERMANENT ]
                    </span>
                  </div>

                  <p style={{ fontSize: "0.75rem", color: "#991b1b", lineHeight: "1.4" }}>
                    Permanently delete your account, call recording audio cache, and clear all lead profiles from device memory.
                  </p>

                  <button
                    type="button"
                    className="btn-delete-account"
                    onClick={() => setDeleteAccountModalOpen(true)}
                  >
                    Delete Account &amp; Purge Data
                  </button>
                </div>
              </main>
            )}
          </>
        )}
      </div>
    </div>
  );
}
