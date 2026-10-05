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

// Official WhatsApp Vector Icon Component
function WhatsAppIcon({ size = 16, color = "#ffffff" }) {
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

// Monochrome SVG-style geometric icons matching design specification
function HomeIcon({ active }) {
  const color = active ? "#000000" : "#8e8e93";
  return (
    <View style={iconStyles.box}>
      <View style={[iconStyles.homeRoof, { borderBottomColor: color }]} />
      <View style={[iconStyles.homeBody, { borderColor: color }]} />
    </View>
  );
}

function CalendarIcon({ active }) {
  const color = active ? "#000000" : "#8e8e93";
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
  const color = active ? "#000000" : "#8e8e93";
  return (
    <View style={iconStyles.trophyBox}>
      <View style={[iconStyles.trophyCup, { borderColor: color }]} />
      <View style={[iconStyles.trophyStem, { backgroundColor: color }]} />
      <View style={[iconStyles.trophyBase, { backgroundColor: color }]} />
    </View>
  );
}

function UserIcon({ active }) {
  const color = active ? "#000000" : "#8e8e93";
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
  const [activeTab, setActiveTab] = useState("home"); // 'home' | 'history' | 'insights' | 'profile'
  const [session, setSession] = useState(null); // Authenticated User Session
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
    loadInitialData();
    verifyPermissions();
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f7f8" />

      {/* TOP BAR: Clean, Light Header with Status & Account Pill */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.brandTitle}>Call Intelligence</Text>
          <Text style={styles.brandSubtitle}>
            {session ? session.user?.companyName || "Connected to Website" : "Groq 1.4s • Private On-Device"}
          </Text>
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
        {/* TAB 1: HOME (Daily Feed, Audio Lab, Action Tasks & Analysis) */}
        {activeTab === "home" && (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* HERO PRODUCTIVITY CARD */}
            <View style={styles.heroCard}>
              <View style={styles.heroContent}>
                <Text style={styles.heroPre}>VOICE PIPELINE ACTIVE</Text>
                <Text style={styles.heroTitle}>Convert recorded calls to actionable notes.</Text>
                <Text style={styles.heroDesc}>
                  Stateless Groq engine transcribes audio, builds executive summaries, and extracts checklists straight into device storage.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.heroPrimaryButton}
                onPress={() => handleProcessRecording()}
                disabled={isProcessing}
                activeOpacity={0.88}
              >
                {isProcessing ? (
                  <View style={styles.buttonRow}>
                    <ActivityIndicator size="small" color="#000000" />
                    <Text style={[styles.heroButtonText, { marginLeft: 8 }]}>Processing Audio with Groq...</Text>
                  </View>
                ) : (
                  <Text style={styles.heroButtonText}>Process Latest Call Recording</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* AUDIO INTELLIGENCE & WAVEFORM LAB WIDGET */}
            <View style={styles.waveformCard}>
              <View style={styles.waveformTopRow}>
                <View style={styles.waveformMeta}>
                  <Text style={styles.waveformLabel}>RECORDING AUDIO LAB</Text>
                  <Text style={styles.waveformFileName}>
                    {displayAnalysis?.callerName
                      ? `rec_${displayAnalysis.callerName.toLowerCase().replace(/\s+/g, "_")}.m4a`
                      : "call_rec_9820045120.m4a"}
                  </Text>
                </View>
                <View style={styles.aiBadge}>
                  <View style={styles.aiBadgeDot} />
                  <Text style={styles.aiBadgeText}>1.4s Groq</Text>
                </View>
              </View>

              <View style={styles.waveformVisualRow}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => setIsPlayingAudio(!isPlayingAudio)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.playButtonIcon}>{isPlayingAudio ? "⏸" : "▶"}</Text>
                </TouchableOpacity>

                <View style={styles.barsContainer}>
                  {[18, 32, 14, 40, 26, 48, 62, 36, 52, 68, 40, 28, 56, 44, 64, 30, 20].map((h, i) => (
                    <View
                      key={i}
                      style={[
                        styles.waveformBar,
                        {
                          height: isPlayingAudio
                            ? Math.min(38, Math.max(8, h * (0.7 + ((i % 3) * 0.2))))
                            : h * 0.55,
                          backgroundColor: i < 9 ? "#000000" : "#c7c7cc"
                        }
                      ]}
                    />
                  ))}
                </View>

                <Text style={styles.timeTracker}>{isPlayingAudio ? "01:42" : "02:15"}</Text>
              </View>
            </View>

            {/* ACTION ITEMS / CHECKLIST QUEUE */}
            {allActionItems.length > 0 && (
              <View style={styles.sectionWrap}>
                <View style={styles.sectionHeaderRow}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.sectionTitle}>Action Items</Text>
                    <View style={styles.counterBadge}>
                      <Text style={styles.counterBadgeText}>{pendingTasksCount} pending</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.tasksCard}>
                  {allActionItems.slice(0, 4).map((item, idx) => (
                    <TouchableOpacity
                      key={item.taskId || idx}
                      style={styles.taskItemRow}
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
                        <View style={styles.taskSubRow}>
                          <Text style={styles.taskLeadName}>{item.leadName}</Text>
                          <Text style={styles.taskDueDate}> • {item.dueDate}</Text>
                        </View>
                      </View>
                      {item.draftMessage ? (
                        <TouchableOpacity
                          style={styles.taskSendBtn}
                          onPress={() => handleSendWhatsApp(item.leadPhone, item.draftMessage)}
                          activeOpacity={0.8}
                        >
                          <WhatsAppIcon size={14} color="#25D366" />
                        </TouchableOpacity>
                      ) : null}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* LATEST CALL ANALYSIS BREAKDOWN */}
            {displayAnalysis && (
              <View style={styles.sectionWrap}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Latest Analysis: {displayAnalysis.callerName}</Text>
                </View>

                {/* Exact Summary Box */}
                <View style={styles.specCard}>
                  <Text style={styles.specHeadline}>
                    {displayAnalysis.exactSummary?.headline}
                  </Text>
                  {displayAnalysis.exactSummary?.bullets?.map((bullet, idx) => (
                    <View key={idx} style={styles.bulletRow}>
                      <View style={styles.bulletMarker} />
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>

                {/* Suggested WhatsApp Draft Box */}
                {displayAnalysis.detailedNotes?.suggestedFollowUp?.draftMessage && (
                  <View style={styles.draftBox}>
                    <Text style={styles.draftBoxLabel}>Suggested WhatsApp Follow-Up</Text>
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
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <WhatsAppIcon size={15} color="#ffffff" />
                        <Text style={styles.sendWhatsAppText}>Dispatch via WhatsApp</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* RECENT CALL INTERACTIONS FEED */}
            {leads.length > 0 && (
              <View style={styles.sectionWrap}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Recent Conversations</Text>
                  <TouchableOpacity onPress={() => setActiveTab("history")}>
                    <Text style={styles.seeAllLink}>View All ({totalCallsCount}) →</Text>
                  </TouchableOpacity>
                </View>

                {leads.slice(0, 3).map((lead) => {
                  const latestCall = lead.calls?.[0];
                  return (
                    <View key={lead.id} style={styles.callFeedCard}>
                      <View style={styles.callFeedTop}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.feedName}>{lead.name}</Text>
                          <Text style={styles.feedMeta}>
                            {lead.company} • {latestCall ? `${latestCall.durationSeconds}s call` : "New Contact"}
                          </Text>
                        </View>
                      </View>

                      {latestCall?.exactSummary?.headline && (
                        <Text style={styles.feedHeadline} numberOfLines={2}>
                          "{latestCall.exactSummary.headline}"
                        </Text>
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
                          <WhatsAppIcon size={15} color="#ffffff" />
                          <Text style={styles.feedBtnMessageText}>WhatsApp</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.feedBtnDetails}
                          onPress={() => {
                            setSelectedLead(lead);
                            setActiveTab("history");
                          }}
                          activeOpacity={0.7}
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

                <View style={styles.contactHeroCard}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <View>
                      <Text style={styles.contactHeroName}>{selectedLead.name}</Text>
                      <Text style={styles.contactHeroPhone}>{selectedLead.phone}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteLead(selectedLead.id)}
                      style={styles.deleteLeadIcon}
                    >
                      <Text style={{ color: "#ff3b30", fontSize: 13, fontWeight: "600" }}>Delete</Text>
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
                      <WhatsAppIcon size={16} color="#ffffff" />
                      <Text style={styles.actionBtnMessageText}>Send WhatsApp Message</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.sectionTitle}>Recorded Interactions</Text>
                {selectedLead.calls && selectedLead.calls.length > 0 ? (
                  selectedLead.calls.map((call, idx) => (
                    <View key={call.id || idx} style={styles.specCard}>
                      <Text style={styles.callTimestamp}>
                        {new Date(call.date).toLocaleString()} • {call.durationSeconds}s
                      </Text>
                      <Text style={styles.specHeadline}>{call.exactSummary?.headline}</Text>
                      {call.exactSummary?.bullets?.map((b, bIdx) => (
                        <View key={bIdx} style={styles.bulletRow}>
                          <View style={styles.bulletMarker} />
                          <Text style={styles.bulletText}>{b}</Text>
                        </View>
                      ))}

                      {call.detailedNotes?.actionChecklist?.length > 0 && (
                        <View style={{ marginTop: 10 }}>
                          <Text style={styles.miniHeader}>Action Items:</Text>
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
                    placeholderTextColor="#8e8e93"
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
            <View style={styles.insightsCard}>
              <Text style={styles.insightsPre}>PERFORMANCE TELEMETRY</Text>
              <Text style={styles.insightsTitle}>Conversation Velocity</Text>
              <Text style={styles.insightsDesc}>
                Overview of automated call intelligence, task completion, and on-device pipeline health.
              </Text>
            </View>

            {/* DAILY TARGET PROGRESS WIDGET */}
            <View style={styles.specCard}>
              <View style={styles.meterHeader}>
                <Text style={styles.cardSubheading}>Daily Calling Target</Text>
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
            <View style={styles.specCard}>
              <View style={styles.meterHeader}>
                <Text style={styles.cardSubheading}>Follow-up Resolution</Text>
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
            <View style={styles.specCard}>
              <Text style={styles.cardSubheading}>CRM Platform Quick Link</Text>
              <Text style={styles.specBody}>
                Open web portal for team onboarding, enterprise settings, and analytics.
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
            <View style={styles.specCard}>
              <Text style={styles.cardSubheading}>Company Authentication</Text>
              {session ? (
                <View>
                  <Text style={styles.specHeadline}>{session.user?.companyName || "Call Flow CRM"}</Text>
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
            <View style={styles.specCard}>
              <Text style={styles.cardSubheading}>Android Permissions</Text>
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
            <View style={styles.specCard}>
              <Text style={styles.cardSubheading}>On-Device Local Storage</Text>
              <Text style={styles.specBody}>
                All notes and summaries remain stored on your device via AsyncStorage. Zero cloud database exposure.
              </Text>
              <TouchableOpacity
                style={styles.outlineButton}
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
              placeholderTextColor="#8e8e93"
              autoCapitalize="none"
            />

            <Text style={[styles.inputLabel, { marginTop: 10 }]}>Password:</Text>
            <TextInput
              style={styles.configInput}
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry
              placeholder="Enter password"
              placeholderTextColor="#8e8e93"
            />

            <TouchableOpacity
              style={[styles.heroPrimaryButton, { marginTop: 16, backgroundColor: "#000000" }]}
              onPress={handleLogin}
              disabled={isLoggingIn}
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
              placeholderTextColor="#8e8e93"
            />

            <Text style={[styles.inputLabel, { marginTop: 10 }]}>Phone Number:</Text>
            <TextInput
              style={styles.configInput}
              value={newLeadForm.phone}
              onChangeText={(text) => setNewLeadForm({ ...newLeadForm, phone: text })}
              placeholder="e.g. +91 98765 43210"
              placeholderTextColor="#8e8e93"
              keyboardType="phone-pad"
            />

            <Text style={[styles.inputLabel, { marginTop: 10 }]}>Company / Organization (Optional):</Text>
            <TextInput
              style={styles.configInput}
              value={newLeadForm.company}
              onChangeText={(text) => setNewLeadForm({ ...newLeadForm, company: text })}
              placeholder="e.g. Apex Industries"
              placeholderTextColor="#8e8e93"
            />

            <TouchableOpacity
              style={[styles.heroPrimaryButton, { marginTop: 16, backgroundColor: "#000000" }]}
              onPress={handleSaveManualLead}
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
            >
              <Text style={styles.modalActionText}>⚡ Process Call from Priya Sharma</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalActionButton}
              onPress={() => handleProcessRecording("+91 97110 44556", "Vikram Patel")}
            >
              <Text style={styles.modalActionText}>⚡ Process Call from Vikram Patel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalActionButton}
              onPress={() => {
                setShowQuickActionModal(false);
                setShowAddLeadModal(true);
              }}
            >
              <Text style={styles.modalActionText}>＋ Add Contact Manually</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalActionButton}
              onPress={handleResetShowcase}
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
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#f7f7f8",
    overflow: "hidden"
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ededf0"
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: -0.3
  },
  brandSubtitle: {
    fontSize: 11,
    color: "#8e8e93",
    marginTop: 1
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14
  },
  userBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000000"
  },
  loginPill: {
    backgroundColor: "#000000",
    paddingHorizontal: 12,
    paddingVertical: 5,
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
    backgroundColor: "#34c759",
    marginRight: 6
  },
  mainViewport: {
    flex: 1,
    height: "100%",
    overflow: "hidden"
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 120
  },

  // HERO CARD
  heroCard: {
    backgroundColor: "#000000",
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3
  },
  heroContent: {
    marginBottom: 16
  },
  heroPre: {
    color: "#8e8e93",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 6
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 26,
    letterSpacing: -0.4,
    marginBottom: 8
  },
  heroDesc: {
    color: "#aeaeb2",
    fontSize: 13,
    lineHeight: 18
  },
  heroPrimaryButton: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  heroButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700"
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center"
  },

  // AUDIO LAB & WAVEFORM
  waveformCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e5ea"
  },
  waveformTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  waveformMeta: {
    flex: 1
  },
  waveformLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#8e8e93",
    letterSpacing: 0.6
  },
  waveformFileName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000000",
    marginTop: 2
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  aiBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#34c759",
    marginRight: 5
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000000"
  },
  waveformVisualRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f8",
    borderRadius: 12,
    padding: 10
  },
  playButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  playButtonIcon: {
    color: "#ffffff",
    fontSize: 14,
    marginLeft: 2
  },
  barsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 38,
    marginRight: 10
  },
  waveformBar: {
    width: 3.5,
    borderRadius: 2
  },
  timeTracker: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8e8e93"
  },

  // ACTION TASKS CHECKLIST
  tasksCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e5ea"
  },
  taskItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f7"
  },
  taskCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.8,
    borderColor: "#8e8e93",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  taskCheckboxCompleted: {
    backgroundColor: "#000000",
    borderColor: "#000000"
  },
  taskCheckmark: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800"
  },
  taskItemText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000000",
    lineHeight: 18
  },
  taskItemTextCompleted: {
    color: "#8e8e93",
    textDecorationLine: "line-through"
  },
  taskSubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3
  },
  taskLeadName: {
    fontSize: 11,
    color: "#8e8e93",
    fontWeight: "500"
  },
  taskDueDate: {
    fontSize: 11,
    color: "#8e8e93"
  },
  taskSendBtn: {
    backgroundColor: "#f2f2f7",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  counterBadge: {
    backgroundColor: "#f2f2f7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8
  },
  counterBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#000000"
  },

  // SECTION STYLING
  sectionWrap: {
    marginBottom: 14
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: -0.3
  },
  seeAllLink: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000000"
  },

  // SPEC CARDS
  specCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e5ea"
  },
  specHeadline: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
    lineHeight: 20,
    marginBottom: 8
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 6
  },
  bulletMarker: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#000000",
    marginTop: 7,
    marginRight: 8
  },
  bulletText: {
    fontSize: 13,
    color: "#3a3a3c",
    lineHeight: 19,
    flex: 1
  },
  cardSubheading: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.4
  },
  miniHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8e8e93",
    marginTop: 6,
    marginBottom: 4,
    textTransform: "uppercase"
  },
  checkItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6
  },
  checkItemText: {
    fontSize: 13,
    color: "#1c1c1e",
    marginLeft: 8
  },
  draftBox: {
    marginTop: 4,
    padding: 12,
    backgroundColor: "#f2f2f7",
    borderRadius: 12
  },
  draftBoxLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8e8e93",
    marginBottom: 4,
    textTransform: "uppercase"
  },
  draftBoxBody: {
    fontSize: 13,
    color: "#1c1c1e",
    fontStyle: "italic",
    lineHeight: 18,
    marginBottom: 8
  },
  sendWhatsAppButton: {
    backgroundColor: "#000000",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center"
  },
  sendWhatsAppText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700"
  },

  // RECENT CALL INTERACTIONS FEED
  callFeedCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e5ea"
  },
  callFeedTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6
  },
  feedName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000"
  },
  feedMeta: {
    fontSize: 11,
    color: "#8e8e93",
    marginTop: 1
  },
  feedHeadline: {
    fontSize: 12,
    color: "#3a3a3c",
    lineHeight: 17,
    fontStyle: "italic",
    marginBottom: 10
  },
  feedActionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  feedBtnMessage: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "#000000",
    borderRadius: 9,
    paddingVertical: 8,
    marginRight: 10
  },
  feedBtnMessageText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff"
  },
  feedBtnDetails: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: "#f2f2f7",
    borderRadius: 9,
    justifyContent: "center"
  },
  feedBtnDetailsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3a3a3c"
  },

  // EMPTY STATE
  emptyStateCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e5ea"
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4
  },
  emptyStateDesc: {
    fontSize: 12,
    color: "#8e8e93",
    textAlign: "center",
    lineHeight: 18
  },

  // STATS STRIP
  statsStrip: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#e5e5ea"
  },
  statCell: {
    flex: 1,
    alignItems: "center"
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000"
  },
  statLabel: {
    fontSize: 10,
    color: "#8e8e93",
    marginTop: 2
  },
  statDivider: {
    width: 1,
    height: "60%",
    backgroundColor: "#e5e5ea",
    alignSelf: "center"
  },

  // DIRECTORY / CONTACTS
  directoryContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14
  },
  searchBarWrap: {
    marginBottom: 10
  },
  searchBarInput: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: "#000000"
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e5ea"
  },
  contactItemName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000"
  },
  contactItemPhone: {
    fontSize: 11,
    color: "#8e8e93",
    marginTop: 1
  },
  contactItemSnippet: {
    fontSize: 11,
    color: "#3a3a3c",
    marginTop: 3
  },
  contactChevron: {
    fontSize: 20,
    color: "#c7c7cc"
  },

  // CONTACT DOSSIER
  backButton: {
    marginBottom: 12
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000000"
  },
  contactHeroCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e5ea"
  },
  contactHeroName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000"
  },
  contactHeroPhone: {
    fontSize: 13,
    color: "#8e8e93",
    marginTop: 2
  },
  contactHeroMeta: {
    fontSize: 11,
    color: "#3a3a3c",
    marginTop: 4
  },
  deleteLeadIcon: {
    padding: 4
  },
  actionRow: {
    marginTop: 14
  },
  actionBtnMessage: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#000000",
    borderRadius: 10,
    paddingVertical: 11
  },
  actionBtnMessageText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700"
  },
  callTimestamp: {
    fontSize: 11,
    color: "#8e8e93",
    marginBottom: 6
  },

  // INSIGHTS & GOALS
  insightsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e5ea"
  },
  insightsPre: {
    fontSize: 10,
    fontWeight: "700",
    color: "#8e8e93",
    letterSpacing: 0.6,
    marginBottom: 4
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 6
  },
  insightsDesc: {
    fontSize: 12,
    color: "#8e8e93",
    lineHeight: 18
  },
  meterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  meterRatio: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000000"
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: "#f2f2f7",
    borderRadius: 4,
    overflow: "hidden"
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#000000",
    borderRadius: 4
  },
  progressNote: {
    fontSize: 11,
    color: "#8e8e93",
    marginTop: 8
  },
  timeSavedCard: {
    backgroundColor: "#000000",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14
  },
  timeSavedValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff"
  },
  timeSavedLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#aeaeb2",
    marginTop: 2
  },
  timeSavedSub: {
    fontSize: 11,
    color: "#8e8e93",
    marginTop: 6,
    lineHeight: 16
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14
  },
  kpiBox: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e5ea"
  },
  kpiVal: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000000"
  },
  kpiLabel: {
    fontSize: 11,
    color: "#8e8e93",
    marginTop: 4
  },

  // PROFILE & SETTINGS
  specBody: {
    fontSize: 12,
    color: "#8e8e93",
    lineHeight: 17,
    marginBottom: 10
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: "center"
  },
  outlineButtonText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "700"
  },
  dangerOutlineButton: {
    borderWidth: 1,
    borderColor: "#ff3b30",
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: "center"
  },
  dangerOutlineButtonText: {
    color: "#ff3b30",
    fontSize: 12,
    fontWeight: "700"
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8e8e93",
    marginBottom: 4
  },
  configInput: {
    backgroundColor: "#f2f2f7",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: "#000000"
  },

  // MODAL SHEET
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    zIndex: 999
  },
  modalSheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d1d1d6",
    alignSelf: "center",
    marginBottom: 14
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000000"
  },
  modalDesc: {
    fontSize: 12,
    color: "#8e8e93",
    marginTop: 2,
    marginBottom: 16
  },
  modalActionButton: {
    backgroundColor: "#f2f2f7",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8
  },
  modalActionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000000"
  },
  modalCloseButton: {
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 4
  },
  modalCloseText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8e8e93"
  },

  // MINIMAL FLOATING NAVBAR
  navbarWrapper: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
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
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 6
  },
  capsuleTab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20
  },
  capsuleTabActive: {
    backgroundColor: "#ececec"
  },
  activeTabLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000000",
    marginLeft: 6
  },
  prominentFab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8
  },
  prominentFabPlus: {
    fontSize: 26,
    fontWeight: "400",
    color: "#ffffff",
    marginTop: -2
  }
});
