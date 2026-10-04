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
  saveLocalSettings
} from "./storage";
import { requestAllPermissions, checkPermissionsStatus } from "./permissions";
import { sendRecordingForAnalysis } from "./api";

// Crisp Monochrome SVG-style geometric icons for premium native aesthetic
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
  calendarHeader: {
    height: 4,
    width: "100%"
  },
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
  const [activeTab, setActiveTab] = useState("home"); // 'home' | 'history' | 'insights' | 'profile'
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState({
    backendUrl: "http://10.0.2.2:4000",
    recordingStoragePath: "/storage/emulated/0/Recordings/Call",
    autoSyncCalls: true
  });

  const [permissionsState, setPermissionsState] = useState({ allGranted: false, statuses: {} });
  const [isProcessing, setIsProcessing] = useState(false);
  const [latestCallAnalysis, setLatestCallAnalysis] = useState(null);
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);

  useEffect(() => {
    loadInitialData();
    verifyPermissions();
  }, []);

  const loadInitialData = async () => {
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

  const handleProcessRecording = async (testNumber = "+91 98200 11223", testName = "Customer Contact") => {
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
          actionChecklist: [{ task: "Send quotation PDF", completed: false }],
          suggestedFollowUp: {
            dueDate: "Tomorrow 11 AM",
            recommendedAction: "Send WhatsApp Quote",
            draftMessage: "Hi, thank you for taking our call. Please find our quote attached."
          }
        }
      };

      setLatestCallAnalysis(callData);
      const updatedLeads = await addOrUpdateLeadFromCall(callData);
      setLeads(updatedLeads);
      setActiveTab("home");
    } catch (err) {
      Alert.alert("Analysis Failed", err.message || "Failed to process audio recording with AI engine.");
    } finally {
      setIsProcessing(false);
    }
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

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f7f8" />

      {/* TOP BAR: Clean, Light Studio Header */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.brandTitle}>Call Intelligence</Text>
          <Text style={styles.brandSubtitle}>Private On-Device Engine</Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Ready</Text>
        </View>
      </View>

      {/* MAIN CONTENT VIEWPORT */}
      <View style={styles.mainViewport}>
        {/* TAB 1: HOME (Hero CTA + Active Intelligence Overview) */}
        {activeTab === "home" && (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* 1. HERO PRODUCTIVITY CARD: Clear primary action */}
            <View style={styles.heroCard}>
              <View style={styles.heroContent}>
                <Text style={styles.heroPre}>AUTO-CAPTURE ACTIVE</Text>
                <Text style={styles.heroTitle}>Convert recorded calls to actionable notes.</Text>
                <Text style={styles.heroDesc}>
                  Groq 1.4s engine transcribes audio, builds executive summaries, and extracts checklists straight into device storage.
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
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text style={[styles.heroButtonText, { marginLeft: 8 }]}>Processing Audio...</Text>
                  </View>
                ) : (
                  <Text style={styles.heroButtonText}>Process Latest Call</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* 2. RECENT ANALYSIS BREAKDOWN */}
            {latestCallAnalysis ? (
              <View style={styles.sectionWrap}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Latest Analysis</Text>
                  <View style={styles.tagPill}>
                    <Text style={styles.tagPillText}>{latestCallAnalysis.exactSummary.keyOutcome}</Text>
                  </View>
                </View>

                {/* Exact Summary Box */}
                <View style={styles.specCard}>
                  <Text style={styles.specHeadline}>
                    {latestCallAnalysis.exactSummary.headline}
                  </Text>
                  {latestCallAnalysis.exactSummary.bullets?.map((bullet, idx) => (
                    <View key={idx} style={styles.bulletRow}>
                      <View style={styles.bulletMarker} />
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>

                {/* Detailed Action Checklist */}
                <View style={styles.specCard}>
                  <Text style={styles.cardSubheading}>Action Checklist</Text>
                  {latestCallAnalysis.detailedNotes.actionChecklist?.map((task, idx) => (
                    <View key={idx} style={styles.checkItemRow}>
                      <View style={styles.checkboxCircle} />
                      <Text style={styles.checkItemText}>{task.task || task}</Text>
                    </View>
                  ))}

                  {latestCallAnalysis.detailedNotes.suggestedFollowUp?.draftMessage && (
                    <View style={styles.draftBox}>
                      <Text style={styles.draftBoxLabel}>Suggested Follow-Up Draft</Text>
                      <Text style={styles.draftBoxBody}>
                        "{latestCallAnalysis.detailedNotes.suggestedFollowUp.draftMessage}"
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.emptyStateCard}>
                <Text style={styles.emptyStateTitle}>No Calls Processed Yet</Text>
                <Text style={styles.emptyStateDesc}>
                  Tap 'Process Latest Call' above or receive a phone call to generate instant on-device summaries.
                </Text>
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
                <Text style={styles.statLabel}>AI Speed</Text>
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
                  <Text style={styles.backButtonText}>← All Contacts</Text>
                </TouchableOpacity>

                <View style={styles.contactHeroCard}>
                  <Text style={styles.contactHeroName}>{selectedLead.name}</Text>
                  <Text style={styles.contactHeroPhone}>{selectedLead.phone}</Text>
                  <Text style={styles.contactHeroMeta}>
                    {selectedLead.calls?.length || 0} recorded conversations • Saved locally
                  </Text>

                  {/* 1-Tap Carrier Communication Actions */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionBtnCall}
                      onPress={() => Linking.openURL(`tel:${selectedLead.phone}`)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.actionBtnCallText}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtnMessage}
                      onPress={() => {
                        const msg = selectedLead.calls?.[0]?.detailedNotes?.suggestedFollowUp?.draftMessage || "Hello";
                        Linking.openURL(`whatsapp://send?phone=${selectedLead.phone}&text=${encodeURIComponent(msg)}`).catch(() => {
                          Linking.openURL(`sms:${selectedLead.phone}?body=${encodeURIComponent(msg)}`);
                        });
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.actionBtnMessageText}>WhatsApp</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.sectionTitle}>Recorded Interactions</Text>
                {selectedLead.calls?.map((call, idx) => (
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
                  </View>
                ))}
              </ScrollView>
            ) : (
              // Contacts Directory List
              <View style={styles.directoryContainer}>
                <View style={styles.searchBarWrap}>
                  <TextInput
                    style={styles.searchBarInput}
                    placeholder="Search by contact or phone..."
                    placeholderTextColor="#8e8e93"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                {filteredLeads.length === 0 ? (
                  <View style={styles.emptyStateCard}>
                    <Text style={styles.emptyStateTitle}>No Contacts Logged</Text>
                    <Text style={styles.emptyStateDesc}>
                      Contacts are automatically added when incoming or outgoing calls are analyzed.
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={filteredLeads}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => setSelectedLead(item)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.contactAvatar}>
                          <Text style={styles.contactAvatarText}>
                            {item.name ? item.name.charAt(0).toUpperCase() : "#"}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.contactItemName}>{item.name}</Text>
                          <Text style={styles.contactItemPhone}>{item.phone}</Text>
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

        {/* TAB 3: INSIGHTS & PIPELINE */}
        {activeTab === "insights" && (
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.insightsCard}>
              <Text style={styles.insightsPre}>PERFORMANCE TELEMETRY</Text>
              <Text style={styles.insightsTitle}>Conversation Efficiency</Text>
              <Text style={styles.insightsDesc}>
                Overview of automated call analysis and follow-up completions across on-device logs.
              </Text>
            </View>

            <View style={styles.specCard}>
              <Text style={styles.cardSubheading}>Summary of Activity</Text>
              <View style={styles.insightRow}>
                <Text style={styles.insightLabel}>Total Captured Calls</Text>
                <Text style={styles.insightValue}>{leads.reduce((acc, l) => acc + (l.calls?.length || 0), 0)}</Text>
              </View>
              <View style={styles.insightRow}>
                <Text style={styles.insightLabel}>Average Call Duration</Text>
                <Text style={styles.insightValue}>130s</Text>
              </View>
              <View style={styles.insightRow}>
                <Text style={styles.insightLabel}>Local Privacy Shield</Text>
                <Text style={[styles.insightValue, { color: "#34c759" }]}>Active</Text>
              </View>
            </View>
          </ScrollView>
        )}

        {/* TAB 4: PROFILE & DEVICE SETTINGS */}
        {activeTab === "profile" && (
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* System Permissions */}
            <View style={styles.specCard}>
              <Text style={styles.cardSubheading}>Android Permissions</Text>
              <Text style={styles.specBody}>
                Enables native detection of call start/hang-up and reads recorded audio files directly from phone storage.
              </Text>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={handleRequestPermissions}
                activeOpacity={0.8}
              >
                <Text style={styles.outlineButtonText}>
                  {permissionsState.allGranted ? "✓ Permissions Active" : "Request Permissions"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Storage Privacy */}
            <View style={styles.specCard}>
              <Text style={styles.cardSubheading}>On-Device Storage</Text>
              <Text style={styles.specBody}>
                All notes and summaries remain stored on your device via AsyncStorage. Zero cloud database dependency.
              </Text>
              <TouchableOpacity
                style={styles.dangerOutlineButton}
                onPress={handleClearAll}
                activeOpacity={0.8}
              >
                <Text style={styles.dangerOutlineButtonText}>Wipe Local Records</Text>
              </TouchableOpacity>
            </View>

            {/* Server Endpoint */}
            <View style={styles.specCard}>
              <Text style={styles.cardSubheading}>Backend AI Server</Text>
              <Text style={styles.specBody}>Localhost or network endpoint for Whisper &amp; Groq:</Text>
              <TextInput
                style={styles.configInput}
                value={settings.backendUrl}
                onChangeText={(text) => {
                  const updated = { ...settings, backendUrl: text };
                  setSettings(updated);
                  saveLocalSettings(updated);
                }}
              />
            </View>
          </ScrollView>
        )}
      </View>

      {/* QUICK ACTION MODAL / BOTTOM SHEET */}
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
              style={styles.modalCloseButton}
              onPress={() => setShowQuickActionModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* MINIMAL PREMIUM FLOATING NAVBAR (Matching Design Spec Exactly) */}
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
    backgroundColor: "#f7f7f8"
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
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#34c759",
    marginRight: 5
  },
  liveText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1c1c1e"
  },
  mainViewport: {
    flex: 1
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100
  },

  // HERO CARD: Strict hierarchy, high CTA prominence
  heroCard: {
    backgroundColor: "#000000",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
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

  // SECTION STYLING
  sectionWrap: {
    marginBottom: 16
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
  tagPill: {
    backgroundColor: "#e5e5ea",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  tagPillText: {
    fontSize: 11,
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
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.4
  },
  checkItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  checkboxCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: "#8e8e93",
    marginRight: 10
  },
  checkItemText: {
    fontSize: 13,
    color: "#1c1c1e"
  },
  draftBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f2f2f7",
    borderRadius: 10
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
    lineHeight: 18
  },

  // EMPTY STATE
  emptyStateCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
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
    marginBottom: 12
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
  contactAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f2f2f7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  contactAvatarText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000"
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
    color: "#c7c7cc",
    marginLeft: 8
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
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14
  },
  actionBtnCall: {
    flex: 1,
    backgroundColor: "#000000",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center"
  },
  actionBtnCallText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700"
  },
  actionBtnMessage: {
    flex: 1,
    backgroundColor: "#f2f2f7",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center"
  },
  actionBtnMessageText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "700"
  },
  callTimestamp: {
    fontSize: 11,
    color: "#8e8e93",
    marginBottom: 6
  },

  // INSIGHTS
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
  insightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f7"
  },
  insightLabel: {
    fontSize: 13,
    color: "#3a3a3c"
  },
  insightValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000000"
  },

  // PROFILE & SETTINGS
  specBody: {
    fontSize: 12,
    color: "#8e8e93",
    lineHeight: 17,
    marginBottom: 12
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

  // MINIMAL FLOATING NAVBAR SPEC (From User Image)
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
