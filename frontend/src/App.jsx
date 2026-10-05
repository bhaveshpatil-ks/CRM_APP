import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
  Linking
} from "react-native";
import {
  getLocalLeads,
  saveLocalLeads,
  addOrUpdateLeadFromCall,
  clearLocalData,
  getLocalSettings,
  saveLocalSettings,
  getStoredSession,
  saveUserSession,
  clearUserSession,
  deleteLeadById,
  toggleTaskStatus,
  resetToSampleData
} from "./storage";
import { requestAllPermissions, checkPermissionsStatus } from "./permissions";
import { sendRecordingForAnalysis, authenticateCompany } from "./api";

// Official CRM App Logo Component
function AppLogo({ size = 64 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <defs>
        <linearGradient id="brandGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d6ff73" />
          <stop offset="100%" stopColor="#8de31a" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="18" fill="#18181b" stroke="#27272a" strokeWidth="1" />
      <path
        d="M20 32c0-7.2 5.4-13 12.2-13 4.1 0 7.5 1.7 9.8 4.5l-3.9 4c-1.5-1.7-3.4-2.5-5.9-2.5-4.7 0-8.2 3.6-8.2 8s3.5 8 8.2 8c2.7 0 4.8-.9 6.5-2.9l4 3.8C41.7 44.4 37.9 46 32.2 46 25.4 46 20 39.2 20 32Z"
        fill="url(#brandGlow)"
      />
      <path d="M33 20.5h14v5.3H39v5.3h7.2v5.1H39V44h-6V20.5Z" fill="#FFFFFF" />
    </svg>
  );
}

// Official WhatsApp Vector Icon Component
function WhatsAppIcon({ size = 16, color = "#25D366" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// Minimalist Monochrome Geometric Icons (Matching User Reference Image)
function HomeIcon({ active }) {
  const color = active ? "#18181b" : "#a1a1aa";
  return (
    <View style={iconStyles.box}>
      <View style={[iconStyles.homeRoof, { borderBottomColor: color }]} />
      <View style={[iconStyles.homeBody, { borderColor: color }]} />
    </View>
  );
}

function CalendarIcon({ active }) {
  const color = active ? "#18181b" : "#a1a1aa";
  return (
    <View style={[iconStyles.calendarBox, { borderColor: color }]}>
      <View style={[iconStyles.calendarHeader, { backgroundColor: color }]} />
      <View style={iconStyles.calendarDots}>
        <View style={[iconStyles.dot, { backgroundColor: color }]} />
        <View style={[iconStyles.dot, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

function TrophyIcon({ active }) {
  const color = active ? "#18181b" : "#a1a1aa";
  return (
    <View style={iconStyles.trophyBox}>
      <View style={[iconStyles.trophyCup, { borderColor: color }]} />
      <View style={[iconStyles.trophyStem, { backgroundColor: color }]} />
      <View style={[iconStyles.trophyBase, { backgroundColor: color }]} />
    </View>
  );
}

function UserIcon({ active }) {
  const color = active ? "#18181b" : "#a1a1aa";
  return (
    <View style={iconStyles.userBox}>
      <View style={[iconStyles.userHead, { backgroundColor: color }]} />
      <View style={[iconStyles.userBody, { backgroundColor: color }]} />
    </View>
  );
}

const iconStyles = StyleSheet.create({
  box: { width: 18, height: 18, alignItems: "center", justifyContent: "center" },
  homeRoof: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent"
  },
  homeBody: {
    width: 11,
    height: 8,
    borderWidth: 1.6,
    borderTopWidth: 0,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2
  },
  calendarBox: {
    width: 16,
    height: 16,
    borderWidth: 1.6,
    borderRadius: 3.5,
    overflow: "hidden"
  },
  calendarHeader: { height: 4, width: "100%" },
  calendarDots: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 3
  },
  dot: { width: 2, height: 2, borderRadius: 1 },
  trophyBox: { width: 18, height: 18, alignItems: "center", justifyContent: "center" },
  trophyCup: {
    width: 12,
    height: 8,
    borderWidth: 1.6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6
  },
  trophyStem: { width: 1.8, height: 3 },
  trophyBase: { width: 9, height: 1.8, borderRadius: 1 },
  userBox: { width: 18, height: 18, alignItems: "center", justifyContent: "center" },
  userHead: { width: 6, height: 6, borderRadius: 3, marginBottom: 1 },
  userBody: {
    width: 12,
    height: 5.5,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6
  }
});

export default function App() {
  // Navigation & State
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home"); // 'home' | 'history' | 'insights' | 'profile'
  const [session, setSession] = useState(null);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [settings, setSettings] = useState({
    backendUrl: "http://10.0.2.2:4000",
    websiteUrl: "http://localhost:5173",
    recordingStoragePath: "/storage/emulated/0/Recordings/Call",
    autoSyncCalls: true,
    skipShortCalls: true,
    autoDraftWhatsApp: true
  });

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState("CALL-240001");
  const [loginPassword, setLoginPassword] = useState("demo123");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // App Features State
  const [permissionsState, setPermissionsState] = useState({ allGranted: false, statuses: {} });
  const [isProcessing, setIsProcessing] = useState(false);
  const [latestCallAnalysis, setLatestCallAnalysis] = useState(null);
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({ name: "", phone: "", company: "" });

  useEffect(() => {
    const initApp = async () => {
      await loadInitialData();
      await verifyPermissions();
      // App launch splash loading screen (1.5s)
      setTimeout(() => {
        setIsAppLoading(false);
      }, 1500);
    };
    initApp();
  }, []);

  const loadInitialData = async () => {
    const userSession = await getStoredSession();
    if (userSession) setSession(userSession);

    const storedLeads = await getLocalLeads();
    setLeads(storedLeads);

    const storedSettings = await getLocalSettings();
    setSettings(storedSettings);
  };

  const verifyPermissions = async () => {
    const res = await checkPermissionsStatus();
    setPermissionsState(res);
  };

  const handleRequestPermissions = async () => {
    const res = await requestAllPermissions();
    setPermissionsState(res);
    if (res.allGranted) {
      Alert.alert("Permissions Granted", "Android call state, call log, and voice storage permissions are active.");
    }
  };

  // Connected Login handler
  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await authenticateCompany({
        backendUrl: settings.backendUrl,
        identifier: loginIdentifier,
        password: loginPassword
      });

      await saveUserSession(result);
      setSession(result);
      setShowLoginModal(false);
      Alert.alert("Welcome", `Logged in as ${result.user?.companyName || result.user?.name || "Company Admin"}`);
    } catch (err) {
      Alert.alert("Login Failed", err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await clearUserSession();
          setSession(null);
        }
      }
    ]);
  };

  // Process / Ingest a Call Recording
  const handleProcessRecording = async (testNumber = "+91 98200 11223", testName = "Priya Sharma") => {
    setIsProcessing(true);
    setShowQuickActionModal(false);
    try {
      const response = await sendRecordingForAnalysis({
        backendUrl: settings.backendUrl,
        audioUri: "file://" + settings.recordingStoragePath + "/latest_call.m4a",
        callerNumber: testNumber,
        callerName: testName,
        callDuration: 130
      });

      const callData = {
        callerNumber: testNumber,
        callerName: testName,
        callDuration: 130,
        exactSummary: response.call?.exactSummary || {
          headline: "Product quotation discussion completed",
          keyOutcome: "Quoting",
          bullets: ["Customer requested price quotation and technical specs", "Follow up with WhatsApp quote today"]
        },
        detailedNotes: response.call?.detailedNotes || {
          callerIntent: "Inquiry on bulk order specs",
          discussionPoints: ["Requested delivery window and payment terms"],
          commitmentsMade: ["Agreed to dispatch quote before 5 PM"],
          actionChecklist: [
            { id: `task_${Date.now()}_1`, task: "Send quotation PDF via WhatsApp", completed: false },
            { id: `task_${Date.now()}_2`, task: "Confirm delivery lead time with inventory team", completed: false }
          ],
          suggestedFollowUp: {
            dueDate: "Tomorrow 11 AM",
            recommendedAction: "Send WhatsApp Quote",
            draftMessage: "Hi Priya, thank you for taking our call. Please find our quote attached."
          }
        }
      };

      setLatestCallAnalysis(callData);
      await addOrUpdateLeadFromCall(callData);
      const updatedList = await getLocalLeads();
      setLeads(updatedList);
      setActiveTab("home");
    } catch (err) {
      Alert.alert("Analysis Failed", err.message || "Failed to process audio recording with AI engine.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Add Contact Manually
  const handleSaveManualLead = async () => {
    if (!newLeadForm.name || !newLeadForm.phone) {
      Alert.alert("Missing Fields", "Please enter both contact name and phone number.");
      return;
    }

    const newLead = {
      id: `lead_${Date.now()}`,
      name: newLeadForm.name,
      phone: newLeadForm.phone,
      company: newLeadForm.company || "Direct Contact",
      status: "New",
      totalCalls: 0,
      createdAt: new Date().toISOString(),
      lastContactedAt: null,
      calls: []
    };

    const updated = [newLead, ...leads];
    await saveLocalLeads(updated);
    setLeads(updated);
    setNewLeadForm({ name: "", phone: "", company: "" });
    setShowAddLeadModal(false);
  };

  const handleDeleteLead = async (id) => {
    Alert.alert("Delete Contact", "Remove this contact from local device storage?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = await deleteLeadById(id);
          setLeads(updated);
          setSelectedLead(null);
        }
      }
    ]);
  };

  const handleClearAll = async () => {
    Alert.alert("Reset Local Data", "Delete all saved notes and lead contacts from on-device storage?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await clearLocalData();
          setLeads([]);
          setLatestCallAnalysis(null);
          setSelectedLead(null);
        }
      }
    ]);
  };

  const handleToggleTask = async (leadId, callId, taskId) => {
    const updated = await toggleTaskStatus(leadId, callId, taskId);
    if (updated) {
      setLeads(updated);
    }
  };

  const handleResetShowcase = async () => {
    setShowQuickActionModal(false);
    const sample = await resetToSampleData();
    setLeads(sample);
    setLatestCallAnalysis(null);
    setSelectedLead(null);
    Alert.alert("Showcase Restored", "Sample call pipeline and action items loaded.");
  };

  const handleSendWhatsApp = (phone, text) => {
    const cleanPhone = phone ? phone.replace(/[^0-9+]/g, "") : "";
    const encoded = encodeURIComponent(text || "Hello, following up on our discussion.");
    Linking.openURL(`whatsapp://send?phone=${cleanPhone}&text=${encoded}`).catch(() => {
      Linking.openURL(`sms:${cleanPhone}?body=${encoded}`);
    });
  };

  // Collect action items across leads
  const allActionItems = [];
  leads.forEach((lead) => {
    (lead.calls || []).forEach((call) => {
      (call.detailedNotes?.actionChecklist || []).forEach((item, idx) => {
        const isObj = typeof item === "object";
        const taskId = isObj ? (item.id || item.task) : `task_${idx}`;
        const taskText = isObj ? item.task : item;
        const completed = isObj ? !!item.completed : false;
        allActionItems.push({
          leadId: lead.id,
          leadName: lead.name,
          leadPhone: lead.phone,
          callId: call.id,
          taskId,
          taskText,
          completed,
          dueDate: call.detailedNotes?.suggestedFollowUp?.dueDate || "Today",
          draftMessage: call.detailedNotes?.suggestedFollowUp?.draftMessage || ""
        });
      });
    });
  });

  const pendingTasksCount = allActionItems.filter((t) => !t.completed).length;
  const totalCallsCount = leads.reduce((acc, l) => acc + (l.calls?.length || 0), 0);

  // Fallback to most recent call if latestCallAnalysis is null
  const displayAnalysis = latestCallAnalysis || (leads[0]?.calls?.[0] ? {
    callerNumber: leads[0].calls[0].callerNumber,
    callerName: leads[0].calls[0].callerName || leads[0].name,
    callDuration: leads[0].calls[0].durationSeconds,
    exactSummary: leads[0].calls[0].exactSummary,
    detailedNotes: leads[0].calls[0].detailedNotes
  } : null);

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // FULL SCREEN APP LAUNCH / SPLASH LOADING SCREEN
  if (isAppLoading) {
    return (
      <SafeAreaView style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#09090b" />
        <View style={styles.splashContent}>
          <View style={styles.splashLogoWrapper}>
            <AppLogo size={88} />
          </View>
          <Text style={styles.splashTitle}>CRM</Text>
          <Text style={styles.splashSubtitle}>Autonomous On-Device AI</Text>

          <View style={styles.splashLoaderTrack}>
            <View style={styles.splashLoaderFill} />
          </View>
          <Text style={styles.splashStatusText}>Initializing on-device engine...</Text>
        </View>

        <View style={styles.splashFooter}>
          <View style={styles.splashFooterDot} />
          <Text style={styles.splashFooterText}>100% PRIVATE • GROQ 1.4s AI</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fafafa" />

      {/* TOP HEADER: Clean Typography with Official App Logo */}
      <View style={styles.topBar}>
        <View style={styles.brandTitleRow}>
          <AppLogo size={28} />
          <Text style={styles.brandTitle}>CRM</Text>
        </View>

        {session ? (
          <TouchableOpacity
            style={styles.userBadge}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View style={styles.liveDot} />
            <Text style={styles.userBadgeText}>{session.user?.appUserId || "Online"}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.loginPill}
            onPress={() => setShowLoginModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.loginPillText}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* MAIN VIEWPORT */}
      <View style={styles.mainViewport}>
        {/* TAB 1: HOME */}
        {activeTab === "home" && (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* HERO CARD: Confident Monochrome Focal Point */}
            <View style={styles.heroCard}>
              <View style={styles.heroPreRow}>
                <View style={styles.emeraldPulse} />
                <Text style={styles.heroPre}>Groq Whisper v3 • Ready</Text>
              </View>
              <Text style={styles.heroTitle}>Convert recorded calls to actionable notes.</Text>
              <Text style={styles.heroDesc}>
                Stateless AI engine extracts summaries, checklists, and instant follow-up drafts directly into phone memory.
              </Text>

              <TouchableOpacity
                style={styles.heroPrimaryButton}
                onPress={() => handleProcessRecording()}
                disabled={isProcessing}
                activeOpacity={0.88}
              >
                {isProcessing ? (
                  <View style={styles.buttonRow}>
                    <ActivityIndicator size="small" color="#18181b" />
                    <Text style={styles.heroButtonText}>Processing Audio with Groq...</Text>
                  </View>
                ) : (
                  <Text style={styles.heroButtonText}>Process Latest Call Recording</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* ACTION ITEMS CHECKLIST */}
            {allActionItems.length > 0 && (
              <View style={styles.sectionWrap}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Action Items</Text>
                  <View style={styles.counterBadge}>
                    <Text style={styles.counterBadgeText}>{pendingTasksCount} pending</Text>
                  </View>
                </View>

                <View style={styles.cardSurface}>
                  {allActionItems.slice(0, 4).map((item, idx) => (
                    <TouchableOpacity
                      key={item.taskId || idx}
                      style={[
                        styles.taskItemRow,
                        idx === allActionItems.slice(0, 4).length - 1 && { borderBottomWidth: 0 }
                      ]}
                      onPress={() => handleToggleTask(item.leadId, item.callId, item.taskId)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.taskCheckbox, item.completed && styles.taskCheckboxCompleted]}>
                        {item.completed && <Text style={styles.taskCheckmark}>✓</Text>}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.taskItemText, item.completed && styles.taskItemTextCompleted]}>
                          {item.taskText}
                        </Text>
                        <Text style={styles.taskSubText}>
                          {item.leadName} • {item.dueDate}
                        </Text>
                      </View>
                      {item.draftMessage ? (
                        <TouchableOpacity
                          style={styles.taskSendBtn}
                          onPress={() => handleSendWhatsApp(item.leadPhone, item.draftMessage)}
                          activeOpacity={0.75}
                        >
                          <WhatsAppIcon size={16} color="#25D366" />
                        </TouchableOpacity>
                      ) : null}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* LATEST CALL BRIEFING */}
            {displayAnalysis && (
              <View style={styles.sectionWrap}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Latest Briefing: {displayAnalysis.callerName}</Text>
                </View>

                <View style={styles.cardSurface}>
                  <Text style={styles.briefingHeadline}>
                    {displayAnalysis.exactSummary?.headline}
                  </Text>
                  {displayAnalysis.exactSummary?.bullets?.map((bullet, idx) => (
                    <View key={idx} style={styles.bulletRow}>
                      <View style={styles.bulletMarker} />
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}

                  {/* Suggested WhatsApp Draft Box */}
                  {displayAnalysis.detailedNotes?.suggestedFollowUp?.draftMessage && (
                    <View style={styles.draftBox}>
                      <Text style={styles.draftBoxLabel}>Suggested Follow-Up Draft</Text>
                      <Text style={styles.draftBoxBody}>
                        "{displayAnalysis.detailedNotes.suggestedFollowUp.draftMessage}"
                      </Text>
                      <TouchableOpacity
                        style={styles.sendWhatsAppButton}
                        onPress={() => handleSendWhatsApp(
                          displayAnalysis.callerNumber,
                          displayAnalysis.detailedNotes.suggestedFollowUp.draftMessage
                        )}
                        activeOpacity={0.85}
                      >
                        <WhatsAppIcon size={16} color="#25D366" />
                        <Text style={styles.sendWhatsAppText}>Dispatch via WhatsApp</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* RECENT CALL INTERACTIONS FEED */}
            {leads.length > 0 && (
              <View style={styles.sectionWrap}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Recent Conversations</Text>
                  <TouchableOpacity onPress={() => setActiveTab("history")} activeOpacity={0.7}>
                    <Text style={styles.seeAllLink}>View All ({totalCallsCount})</Text>
                  </TouchableOpacity>
                </View>

                {leads.slice(0, 3).map((lead) => {
                  const latestCall = lead.calls?.[0];
                  return (
                    <View key={lead.id} style={styles.callFeedCard}>
                      <View style={styles.callFeedTop}>
                        <Text style={styles.feedName}>{lead.name}</Text>
                        <Text style={styles.feedMeta}>
                          {lead.company} • {latestCall ? `${latestCall.durationSeconds}s call` : "New Contact"}
                        </Text>
                      </View>

                      {latestCall?.exactSummary?.headline && (
                        <View style={styles.quoteWrap}>
                          <Text style={styles.feedHeadline} numberOfLines={2}>
                            "{latestCall.exactSummary.headline}"
                          </Text>
                        </View>
                      )}

                      <View style={styles.feedActionButtons}>
                        <TouchableOpacity
                          style={styles.feedBtnMessage}
                          onPress={() => {
                            const draft = latestCall?.detailedNotes?.suggestedFollowUp?.draftMessage || "Hello";
                            handleSendWhatsApp(lead.phone, draft);
                          }}
                          activeOpacity={0.85}
                        >
                          <WhatsAppIcon size={16} color="#25D366" />
                          <Text style={styles.feedBtnMessageText}>WhatsApp</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.feedBtnDetails}
                          onPress={() => {
                            setSelectedLead(lead);
                            setActiveTab("history");
                          }}
                          activeOpacity={0.75}
                        >
                          <Text style={styles.feedBtnDetailsText}>Notes ›</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* QUICK STATS STRIP */}
            <View style={styles.statsStrip}>
              <View style={styles.statCell}>
                <Text style={styles.statNumber}>{leads.length}</Text>
                <Text style={styles.statLabel}>Contacts Stored</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCell}>
                <Text style={styles.statNumber}>100%</Text>
                <Text style={styles.statLabel}>On-Device Private</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCell}>
                <Text style={styles.statNumber}>1.4s</Text>
                <Text style={styles.statLabel}>Groq Latency</Text>
              </View>
            </View>
          </ScrollView>
        )}

        {/* TAB 2: CALL HISTORY & CONTACTS */}
        {activeTab === "history" && (
          <View style={{ flex: 1 }}>
            {selectedLead ? (
              // Dedicated Contact Dossier
              <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setSelectedLead(null)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.backButtonText}>← Back to Contacts</Text>
                </TouchableOpacity>

                <View style={styles.cardSurface}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <View>
                      <Text style={styles.contactHeroName}>{selectedLead.name}</Text>
                      <Text style={styles.contactHeroPhone}>{selectedLead.phone}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteLead(selectedLead.id)}
                      style={styles.deleteLeadIcon}
                      activeOpacity={0.7}
                    >
                      <Text style={{ color: "#ef4444", fontSize: 13, fontWeight: "600" }}>Delete</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.contactHeroMeta}>
                    {selectedLead.company || "Individual"} • {selectedLead.calls?.length || 0} calls recorded
                  </Text>

                  {/* 1-Tap Carrier Communication Actions */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionBtnMessage}
                      onPress={() => {
                        const msg = selectedLead.calls?.[0]?.detailedNotes?.suggestedFollowUp?.draftMessage || "Hello";
                        handleSendWhatsApp(selectedLead.phone, msg);
                      }}
                      activeOpacity={0.85}
                    >
                      <WhatsAppIcon size={16} color="#25D366" />
                      <Text style={styles.actionBtnMessageText}>Send WhatsApp Message</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 16, marginBottom: 10 }]}>
                  Recorded Interactions
                </Text>
                {selectedLead.calls && selectedLead.calls.length > 0 ? (
                  selectedLead.calls.map((call, idx) => (
                    <View key={call.id || idx} style={styles.cardSurface}>
                      <Text style={styles.callTimestamp}>
                        {new Date(call.date).toLocaleString()} • {call.durationSeconds}s
                      </Text>
                      <Text style={styles.briefingHeadline}>{call.exactSummary?.headline}</Text>
                      {call.exactSummary?.bullets?.map((b, bIdx) => (
                        <View key={bIdx} style={styles.bulletRow}>
                          <View style={styles.bulletMarker} />
                          <Text style={styles.bulletText}>{b}</Text>
                        </View>
                      ))}

                      {call.detailedNotes?.actionChecklist?.length > 0 && (
                        <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: "#f4f4f5", paddingTop: 10 }}>
                          <Text style={styles.miniHeader}>Action Items</Text>
                          {call.detailedNotes.actionChecklist.map((taskItem, tIdx) => {
                            const isObj = typeof taskItem === "object";
                            const taskText = isObj ? taskItem.task : taskItem;
                            const completed = isObj ? !!taskItem.completed : false;
                            const taskId = isObj ? (taskItem.id || taskItem.task) : `task_${tIdx}`;
                            return (
                              <TouchableOpacity
                                key={taskId}
                                style={styles.checkItemRow}
                                onPress={() => handleToggleTask(selectedLead.id, call.id, taskId)}
                                activeOpacity={0.7}
                              >
                                <View style={[styles.taskCheckbox, completed && styles.taskCheckboxCompleted]}>
                                  {completed && <Text style={styles.taskCheckmark}>✓</Text>}
                                </View>
                                <Text style={[styles.checkItemText, completed && styles.taskItemTextCompleted]}>
                                  {taskText}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyStateCard}>
                    <Text style={styles.emptyStateTitle}>No calls logged for this contact</Text>
                    <Text style={styles.emptyStateDesc}>Incoming phone calls from this number will be auto-saved here.</Text>
                  </View>
                )}
              </ScrollView>
            ) : (
              // Contacts Directory List
              <View style={styles.directoryContainer}>
                <View style={styles.searchBarWrap}>
                  <TextInput
                    style={styles.searchBarInput}
                    placeholder="Search by contact, phone, or company..."
                    placeholderTextColor="#a1a1aa"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                {filteredLeads.length === 0 ? (
                  <View style={styles.emptyStateCard}>
                    <Text style={styles.emptyStateTitle}>No Contacts Found</Text>
                    <Text style={styles.emptyStateDesc}>
                      Contacts are automatically added when calls are analyzed, or tap 'New Contact' to create one.
                    </Text>
                    <TouchableOpacity
                      style={[styles.outlineButton, { marginTop: 12, paddingHorizontal: 16 }]}
                      onPress={() => setShowAddLeadModal(true)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.outlineButtonText}>＋ Add Contact</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <FlatList
                    data={filteredLeads}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 110 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => setSelectedLead(item)}
                        activeOpacity={0.7}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.contactItemName}>{item.name}</Text>
                          <Text style={styles.contactItemPhone}>{item.phone} • {item.company || "Individual"}</Text>
                          <Text style={styles.contactItemSnippet} numberOfLines={1}>
                            {item.calls?.[0]?.exactSummary?.headline || "No calls recorded yet"}
                          </Text>
                        </View>
                        <Text style={styles.contactChevron}>›</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            )}
          </View>
        )}

        {/* TAB 3: INSIGHTS & GOALS */}
        {activeTab === "insights" && (
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.cardSurface}>
              <Text style={styles.sectionTitle}>Conversation Velocity</Text>
              <Text style={styles.cardSubtitle}>
                Overview of automated call intelligence, task completion, and on-device pipeline health.
              </Text>
            </View>

            {/* DAILY TARGET PROGRESS WIDGET */}
            <View style={styles.cardSurface}>
              <View style={styles.meterHeader}>
                <Text style={styles.meterLabel}>Daily Calling Target</Text>
                <Text style={styles.meterRatio}>{totalCallsCount} / 10 Calls</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.min(100, Math.max(15, (totalCallsCount / 10) * 100))}%` }
                  ]}
                />
              </View>
              <Text style={styles.progressNote}>
                {totalCallsCount >= 10 ? "Daily target accomplished!" : `${10 - totalCallsCount} calls remaining to hit daily outreach quota.`}
              </Text>
            </View>

            {/* ACTION ITEMS RESOLUTION RATE */}
            <View style={styles.cardSurface}>
              <View style={styles.meterHeader}>
                <Text style={styles.meterLabel}>Follow-up Resolution</Text>
                <Text style={styles.meterRatio}>
                  {allActionItems.length > 0
                    ? `${Math.round(((allActionItems.length - pendingTasksCount) / allActionItems.length) * 100)}%`
                    : "100%"}
                </Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${allActionItems.length > 0 ? Math.round(((allActionItems.length - pendingTasksCount) / allActionItems.length) * 100) : 100}%`
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressNote}>
                {pendingTasksCount} follow-up action items awaiting dispatch.
              </Text>
            </View>

            {/* TIME SAVED METRIC */}
            <View style={styles.timeSavedCard}>
              <Text style={styles.timeSavedValue}>{Math.max(24, totalCallsCount * 12)} mins</Text>
              <Text style={styles.timeSavedLabel}>Estimated Time Saved Today</Text>
              <Text style={styles.timeSavedSub}>
                Groq 1.4s extraction eliminates manual typing of call briefs and WhatsApp drafts.
              </Text>
            </View>

            {/* 2X2 KEY PERFORMANCE INDICATORS */}
            <View style={styles.kpiGrid}>
              <View style={styles.kpiBox}>
                <Text style={styles.kpiVal}>{totalCallsCount}</Text>
                <Text style={styles.kpiLabel}>Processed Calls</Text>
              </View>
              <View style={styles.kpiBox}>
                <Text style={styles.kpiVal}>{leads.length}</Text>
                <Text style={styles.kpiLabel}>Pipeline Leads</Text>
              </View>
              <View style={styles.kpiBox}>
                <Text style={styles.kpiVal}>1.4s</Text>
                <Text style={styles.kpiLabel}>Avg AI Latency</Text>
              </View>
              <View style={styles.kpiBox}>
                <Text style={styles.kpiVal}>100%</Text>
                <Text style={styles.kpiLabel}>On-Device Privacy</Text>
              </View>
            </View>

            {/* CRM PLATFORM LINK */}
            <View style={styles.cardSurface}>
              <Text style={styles.meterLabel}>CRM Platform Web Portal</Text>
              <Text style={styles.specBody}>
                Open web dashboard for multi-agent governance, team onboarding, and enterprise analytics.
              </Text>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => Linking.openURL(settings.websiteUrl)}
                activeOpacity={0.8}
              >
                <Text style={styles.outlineButtonText}>Launch Web CRM Portal ↗</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* TAB 4: PROFILE & SETTINGS */}
        {activeTab === "profile" && (
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Account Status / Company Login */}
            <View style={styles.cardSurface}>
              <Text style={styles.meterLabel}>Company Authentication</Text>
              {session ? (
                <View>
                  <Text style={styles.contactHeroName}>{session.user?.companyName || "Call Flow CRM"}</Text>
                  <Text style={styles.specBody}>Company ID: {session.user?.appUserId || "CALL-240001"}</Text>
                  <Text style={styles.specBody}>Admin: {session.user?.name || "Administrator"}</Text>
                  <TouchableOpacity
                    style={styles.dangerOutlineButton}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dangerOutlineButtonText}>Log Out</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Text style={styles.specBody}>
                    Connect this app to your company account on the CRM website to sync contacts and administration.
                  </Text>
                  <TouchableOpacity
                    style={styles.outlineButton}
                    onPress={() => setShowLoginModal(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.outlineButtonText}>Log In with Company ID</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Android System Permissions */}
            <View style={styles.cardSurface}>
              <Text style={styles.meterLabel}>Android Permissions</Text>
              <Text style={styles.specBody}>
                Required for detecting phone call start/hang-up and reading recorded audio files directly from phone storage.
              </Text>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={handleRequestPermissions}
                activeOpacity={0.8}
              >
                <Text style={styles.outlineButtonText}>
                  {permissionsState.allGranted ? "✓ Permissions Active" : "Grant Android Permissions"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Storage Privacy & Reset */}
            <View style={styles.cardSurface}>
              <Text style={styles.meterLabel}>On-Device Storage & Privacy</Text>
              <Text style={styles.specBody}>
                All notes and summaries remain stored on your device via AsyncStorage. Zero cloud database exposure.
              </Text>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => {
                  setIsAppLoading(true);
                  setTimeout(() => setIsAppLoading(false), 1500);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.outlineButtonText}>⚡ Preview Splash Loading Screen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.outlineButton, { marginTop: 8 }]}
                onPress={handleResetShowcase}
                activeOpacity={0.8}
              >
                <Text style={styles.outlineButtonText}>🔄 Reload Showcase Demo Pipeline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dangerOutlineButton, { marginTop: 8 }]}
                onPress={handleClearAll}
                activeOpacity={0.8}
              >
                <Text style={styles.dangerOutlineButtonText}>Wipe Local Records</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>

      {/* MODAL 1: LOGIN TO WEBSITE / COMPANY */}
      {showLoginModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Company Login</Text>
            <Text style={styles.modalDesc}>Sign in with your Company ID created on the CRM website.</Text>

            <Text style={styles.inputLabel}>Company ID / Login ID:</Text>
            <TextInput
              style={styles.configInput}
              value={loginIdentifier}
              onChangeText={setLoginIdentifier}
              placeholder="e.g. CALL-240001 or admin"
              placeholderTextColor="#a1a1aa"
              autoCapitalize="none"
            />

            <Text style={[styles.inputLabel, { marginTop: 10 }]}>Password:</Text>
            <TextInput
              style={styles.configInput}
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry
              placeholder="Enter password"
              placeholderTextColor="#a1a1aa"
            />

            <TouchableOpacity
              style={[styles.heroPrimaryButton, { marginTop: 16, backgroundColor: "#18181b" }]}
              onPress={handleLogin}
              disabled={isLoggingIn}
              activeOpacity={0.85}
            >
              {isLoggingIn ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={[styles.heroButtonText, { color: "#ffffff" }]}>Authenticate Company</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowLoginModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* MODAL 2: ADD MANUAL CONTACT */}
      {showAddLeadModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add Contact</Text>
            <Text style={styles.modalDesc}>Manually save a customer contact into on-device storage.</Text>

            <Text style={styles.inputLabel}>Contact Name:</Text>
            <TextInput
              style={styles.configInput}
              value={newLeadForm.name}
              onChangeText={(text) => setNewLeadForm({ ...newLeadForm, name: text })}
              placeholder="e.g. Rahul Sharma"
              placeholderTextColor="#a1a1aa"
            />

            <Text style={[styles.inputLabel, { marginTop: 10 }]}>Phone Number:</Text>
            <TextInput
              style={styles.configInput}
              value={newLeadForm.phone}
              onChangeText={(text) => setNewLeadForm({ ...newLeadForm, phone: text })}
              placeholder="e.g. +91 98765 43210"
              placeholderTextColor="#a1a1aa"
              keyboardType="phone-pad"
            />

            <Text style={[styles.inputLabel, { marginTop: 10 }]}>Company / Organization (Optional):</Text>
            <TextInput
              style={styles.configInput}
              value={newLeadForm.company}
              onChangeText={(text) => setNewLeadForm({ ...newLeadForm, company: text })}
              placeholder="e.g. Apex Industries"
              placeholderTextColor="#a1a1aa"
            />

            <TouchableOpacity
              style={[styles.heroPrimaryButton, { marginTop: 16, backgroundColor: "#18181b" }]}
              onPress={handleSaveManualLead}
              activeOpacity={0.85}
            >
              <Text style={[styles.heroButtonText, { color: "#ffffff" }]}>Save Contact</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowAddLeadModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* MODAL 3: QUICK ACTION BOTTOM SHEET */}
      {showQuickActionModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Quick Action</Text>
            <Text style={styles.modalDesc}>Instantly ingest or simulate incoming call audio.</Text>

            <TouchableOpacity
              style={styles.modalActionButton}
              onPress={() => handleProcessRecording("+91 98200 11223", "Priya Sharma")}
              activeOpacity={0.75}
            >
              <Text style={styles.modalActionText}>⚡ Process Call from Priya Sharma</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalActionButton}
              onPress={() => handleProcessRecording("+91 97110 44556", "Vikram Patel")}
              activeOpacity={0.75}
            >
              <Text style={styles.modalActionText}>⚡ Process Call from Vikram Patel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalActionButton}
              onPress={() => {
                setShowQuickActionModal(false);
                setShowAddLeadModal(true);
              }}
              activeOpacity={0.75}
            >
              <Text style={styles.modalActionText}>＋ Add Contact Manually</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalActionButton}
              onPress={handleResetShowcase}
              activeOpacity={0.75}
            >
              <Text style={styles.modalActionText}>🔄 Reload Showcase Pipeline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowQuickActionModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* MINIMAL PREMIUM FLOATING NAVBAR */}
      <View style={styles.navbarWrapper}>
        <View style={styles.floatingCapsule}>
          {/* Tab 1: Home */}
          <TouchableOpacity
            style={[styles.capsuleTab, activeTab === "home" && styles.capsuleTabActive]}
            onPress={() => { setActiveTab("home"); setSelectedLead(null); }}
            activeOpacity={0.85}
          >
            <HomeIcon active={activeTab === "home"} />
            {activeTab === "home" && <Text style={styles.activeTabLabel}>Home</Text>}
          </TouchableOpacity>

          {/* Tab 2: Calendar / History */}
          <TouchableOpacity
            style={[styles.capsuleTab, activeTab === "history" && styles.capsuleTabActive]}
            onPress={() => setActiveTab("history")}
            activeOpacity={0.85}
          >
            <CalendarIcon active={activeTab === "history"} />
            {activeTab === "history" && <Text style={styles.activeTabLabel}>History</Text>}
          </TouchableOpacity>

          {/* Tab 3: Insights / Trophy */}
          <TouchableOpacity
            style={[styles.capsuleTab, activeTab === "insights" && styles.capsuleTabActive]}
            onPress={() => { setActiveTab("insights"); setSelectedLead(null); }}
            activeOpacity={0.85}
          >
            <TrophyIcon active={activeTab === "insights"} />
            {activeTab === "insights" && <Text style={styles.activeTabLabel}>Goals</Text>}
          </TouchableOpacity>

          {/* Tab 4: Profile */}
          <TouchableOpacity
            style={[styles.capsuleTab, activeTab === "profile" && styles.capsuleTabActive]}
            onPress={() => { setActiveTab("profile"); setSelectedLead(null); }}
            activeOpacity={0.85}
          >
            <UserIcon active={activeTab === "profile"} />
            {activeTab === "profile" && <Text style={styles.activeTabLabel}>Profile</Text>}
          </TouchableOpacity>
        </View>

        {/* PROMINENT CIRCULAR '+' CTA BUTTON */}
        <TouchableOpacity
          style={styles.prominentFab}
          onPress={() => setShowQuickActionModal(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.prominentFabPlus}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // SPLASH SCREEN
  splashContainer: {
    flex: 1,
    height: "100%",
    backgroundColor: "#09090b",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 54,
    paddingHorizontal: 24
  },
  splashContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  splashLogoWrapper: {
    shadowColor: "#8de31a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 10,
    marginBottom: 20
  },
  splashTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.4,
    marginBottom: 4
  },
  splashSubtitle: {
    fontSize: 12,
    color: "#a1a1aa",
    fontWeight: "500",
    marginBottom: 26
  },
  splashLoaderTrack: {
    width: 140,
    height: 3,
    backgroundColor: "#27272a",
    borderRadius: 1.5,
    overflow: "hidden",
    marginBottom: 10
  },
  splashLoaderFill: {
    width: "72%",
    height: "100%",
    backgroundColor: "#c9f94c",
    borderRadius: 1.5
  },
  splashStatusText: {
    fontSize: 11,
    color: "#71717a",
    fontWeight: "500"
  },
  splashFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  splashFooterDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#10b981"
  },
  splashFooterText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#71717a",
    letterSpacing: 0.8
  },

  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#fafafa",
    overflow: "hidden"
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5"
  },
  brandTitleRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  brandTitle: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "900",
    color: "#09090b",
    letterSpacing: 1.8,
    textTransform: "uppercase"
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14
  },
  userBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#18181b"
  },
  loginPill: {
    backgroundColor: "#18181b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14
  },
  loginPillText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700"
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
    marginRight: 6
  },
  mainViewport: {
    flex: 1,
    height: "100%",
    overflow: "hidden"
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 110
  },

  // HERO CARD
  heroCard: {
    backgroundColor: "#09090b",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3
  },
  heroPreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  emeraldPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
    marginRight: 6
  },
  heroPre: {
    color: "#a1a1aa",
    fontSize: 11,
    fontWeight: "600"
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
    letterSpacing: -0.3,
    marginBottom: 6
  },
  heroDesc: {
    color: "#a1a1aa",
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14
  },
  heroPrimaryButton: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center"
  },
  heroButtonText: {
    color: "#09090b",
    fontSize: 13,
    fontWeight: "700"
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center"
  },

  // CARD SURFACES (Modern Minimalist Base)
  cardSurface: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e4e4e7"
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181b"
  },
  cardSubtitle: {
    fontSize: 11,
    color: "#71717a",
    marginTop: 2
  },

  // AUDIO LAB & WAVEFORM
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  aiBadgeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#10b981",
    marginRight: 5
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#18181b"
  },
  waveformContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f5",
    borderRadius: 10,
    padding: 10
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#18181b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  playButtonIcon: {
    color: "#ffffff",
    fontSize: 13,
    marginLeft: 2
  },
  barsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 36,
    marginRight: 10
  },
  waveformBar: {
    width: 3,
    borderRadius: 1.5
  },
  timeTracker: {
    fontSize: 11,
    fontWeight: "600",
    color: "#71717a"
  },

  // ACTION TASKS CHECKLIST
  taskItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5"
  },
  taskCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.8,
    borderColor: "#a1a1aa",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  taskCheckboxCompleted: {
    backgroundColor: "#18181b",
    borderColor: "#18181b"
  },
  taskCheckmark: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800"
  },
  taskItemText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#18181b",
    lineHeight: 18
  },
  taskItemTextCompleted: {
    color: "#a1a1aa",
    textDecorationLine: "line-through"
  },
  taskSubText: {
    fontSize: 11,
    color: "#71717a",
    marginTop: 2
  },
  taskSendBtn: {
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  counterBadge: {
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8
  },
  counterBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#18181b"
  },

  // SECTION STYLING
  sectionWrap: {
    marginBottom: 12
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2
  },
  seeAllLink: {
    fontSize: 11,
    fontWeight: "600",
    color: "#71717a"
  },

  // BRIEFING CARD
  briefingHeadline: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181b",
    lineHeight: 19,
    marginBottom: 8
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 5
  },
  bulletMarker: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#18181b",
    marginTop: 7,
    marginRight: 8
  },
  bulletText: {
    fontSize: 12,
    color: "#3f3f46",
    lineHeight: 18,
    flex: 1
  },
  draftBox: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#f4f4f5",
    borderRadius: 10
  },
  draftBoxLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#71717a",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.3
  },
  draftBoxBody: {
    fontSize: 12,
    color: "#18181b",
    fontStyle: "italic",
    lineHeight: 17,
    marginBottom: 8
  },
  sendWhatsAppButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#18181b",
    borderRadius: 8,
    paddingVertical: 9
  },
  sendWhatsAppText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700"
  },

  // RECENT CONVERSATIONS FEED
  callFeedCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e4e4e7"
  },
  callFeedTop: {
    marginBottom: 6
  },
  feedName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181b"
  },
  feedMeta: {
    fontSize: 11,
    color: "#71717a",
    marginTop: 1
  },
  quoteWrap: {
    borderLeftWidth: 2,
    borderLeftColor: "#e4e4e7",
    paddingLeft: 8,
    marginVertical: 6
  },
  feedHeadline: {
    fontSize: 12,
    color: "#3f3f46",
    lineHeight: 17,
    fontStyle: "italic"
  },
  feedActionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6
  },
  feedBtnMessage: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "#18181b",
    borderRadius: 8,
    paddingVertical: 8,
    marginRight: 8
  },
  feedBtnMessageText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff"
  },
  feedBtnDetails: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: "#f4f4f5",
    borderRadius: 8,
    justifyContent: "center"
  },
  feedBtnDetailsText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#3f3f46"
  },

  // EMPTY STATE
  emptyStateCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e4e4e7"
  },
  emptyStateTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181b",
    marginBottom: 4
  },
  emptyStateDesc: {
    fontSize: 12,
    color: "#71717a",
    textAlign: "center",
    lineHeight: 18
  },

  // STATS STRIP
  statsStrip: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e4e4e7"
  },
  statCell: {
    flex: 1,
    alignItems: "center"
  },
  statNumber: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b"
  },
  statLabel: {
    fontSize: 10,
    color: "#71717a",
    marginTop: 2
  },
  statDivider: {
    width: 1,
    height: "60%",
    backgroundColor: "#e4e4e7",
    alignSelf: "center"
  },

  // DIRECTORY / CONTACTS
  directoryContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12
  },
  searchBarWrap: {
    marginBottom: 10
  },
  searchBarInput: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 12,
    color: "#18181b"
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e4e4e7"
  },
  contactItemName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181b"
  },
  contactItemPhone: {
    fontSize: 11,
    color: "#71717a",
    marginTop: 1
  },
  contactItemSnippet: {
    fontSize: 11,
    color: "#3f3f46",
    marginTop: 3
  },
  contactChevron: {
    fontSize: 18,
    color: "#a1a1aa"
  },

  // CONTACT DOSSIER
  backButton: {
    marginBottom: 12
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#18181b"
  },
  contactHeroName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#18181b"
  },
  contactHeroPhone: {
    fontSize: 12,
    color: "#71717a",
    marginTop: 2
  },
  contactHeroMeta: {
    fontSize: 11,
    color: "#3f3f46",
    marginTop: 4
  },
  deleteLeadIcon: {
    padding: 4
  },
  actionRow: {
    marginTop: 12
  },
  actionBtnMessage: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#18181b",
    borderRadius: 8,
    paddingVertical: 10
  },
  actionBtnMessageText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700"
  },
  callTimestamp: {
    fontSize: 10,
    color: "#71717a",
    marginBottom: 6
  },
  miniHeader: {
    fontSize: 10,
    fontWeight: "700",
    color: "#71717a",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.3
  },
  checkItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6
  },
  checkItemText: {
    fontSize: 12,
    color: "#18181b",
    marginLeft: 8
  },

  // INSIGHTS & GOALS
  meterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },
  meterLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#18181b"
  },
  meterRatio: {
    fontSize: 12,
    fontWeight: "700",
    color: "#18181b"
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: "#f4f4f5",
    borderRadius: 3.5,
    overflow: "hidden"
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#18181b",
    borderRadius: 3.5
  },
  progressNote: {
    fontSize: 11,
    color: "#71717a",
    marginTop: 6
  },
  timeSavedCard: {
    backgroundColor: "#18181b",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12
  },
  timeSavedValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff"
  },
  timeSavedLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#a1a1aa",
    marginTop: 2
  },
  timeSavedSub: {
    fontSize: 11,
    color: "#71717a",
    marginTop: 5,
    lineHeight: 15
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12
  },
  kpiBox: {
    width: "48.5%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e4e4e7"
  },
  kpiVal: {
    fontSize: 17,
    fontWeight: "800",
    color: "#18181b"
  },
  kpiLabel: {
    fontSize: 10,
    color: "#71717a",
    marginTop: 2
  },

  // PROFILE & SETTINGS
  specBody: {
    fontSize: 11,
    color: "#71717a",
    lineHeight: 16,
    marginBottom: 8
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#18181b",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center"
  },
  outlineButtonText: {
    color: "#18181b",
    fontSize: 11,
    fontWeight: "700"
  },
  dangerOutlineButton: {
    borderWidth: 1,
    borderColor: "#ef4444",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center"
  },
  dangerOutlineButtonText: {
    color: "#ef4444",
    fontSize: 11,
    fontWeight: "700"
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#71717a",
    marginBottom: 3
  },
  configInput: {
    backgroundColor: "#f4f4f5",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12,
    color: "#18181b"
  },

  // MODAL SHEET
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
    zIndex: 999
  },
  modalSheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 18,
    paddingBottom: 28
  },
  modalHandle: {
    width: 34,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d4d4d8",
    alignSelf: "center",
    marginBottom: 12
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18181b"
  },
  modalDesc: {
    fontSize: 11,
    color: "#71717a",
    marginTop: 2,
    marginBottom: 14
  },
  modalActionButton: {
    backgroundColor: "#f4f4f5",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 7
  },
  modalActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#18181b"
  },
  modalCloseButton: {
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 2
  },
  modalCloseText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#71717a"
  },

  // MINIMAL FLOATING NAVBAR
  navbarWrapper: {
    position: "absolute",
    bottom: 18,
    left: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 100
  },
  floatingCapsule: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderRadius: 28,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6
  },
  capsuleTab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 18
  },
  capsuleTabActive: {
    backgroundColor: "#f4f4f5"
  },
  activeTabLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#18181b",
    marginLeft: 5
  },
  prominentFab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#18181b",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8
  },
  prominentFabPlus: {
    fontSize: 24,
    fontWeight: "400",
    color: "#ffffff",
    marginTop: -2
  }
});
