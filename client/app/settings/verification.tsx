import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  getMe,
  requestEmailOtp,
  confirmEmailOtp,
  requestPhoneOtp,
  confirmPhoneOtp,
} from "../api"; // adjust path

// Theme like Settings
const BG = "#070A17";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(255,255,255,0.10)";
const TEXT = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.68)";
const ACCENT = "#EAD0F7";

type Mode = "email" | "phone";
type Step = "enter" | "otp";

export default function VerificationScreen() {
  const router = useRouter();

  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("email");
  const [step, setStep] = useState<Step>("enter");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const [busy, setBusy] = useState(false);

  const emailVerified = !!me?.emailVerified;
  const phoneVerified = !!me?.phoneVerified;

  const title = useMemo(
    () => (mode === "email" ? "Email verification" : "Phone verification"),
    [mode]
  );

  const refreshMe = async () => {
    const u = await getMe();
    setMe(u);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await refreshMe();
      } catch (e: any) {
        Alert.alert("Error", e?.message || "Could not load profile");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const start = (m: Mode) => {
    setMode(m);
    setStep("enter");
    setCode("");
    setOpen(true);

    // prefill if backend returns email/phone
    if (m === "email") setEmail(me?.email || "");
    if (m === "phone") setPhone(me?.phone || "");
  };

  const close = () => {
    setOpen(false);
    setBusy(false);
    setStep("enter");
    setCode("");
  };

  const sendOtp = async () => {
    try {
      setBusy(true);

      if (mode === "email") {
        const clean = email.trim().toLowerCase();
        if (!clean) return Alert.alert("Oops 😄", "Please enter an email.");
        await requestEmailOtp(clean);
      } else {
        const clean = phone.trim();
        if (!clean)
          return Alert.alert("Oops 😄", "Please enter a phone number.");
        await requestPhoneOtp(clean);
      }

      setStep("otp");
      Alert.alert("Sent ✨", "Check your messages for the verification code.");
    } catch (e: any) {
      Alert.alert("Couldn’t send", e?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const confirmOtp = async () => {
    try {
      setBusy(true);
      const clean = code.trim();
      if (!clean) return Alert.alert("Oops 😄", "Enter the code you received.");

      if (mode === "email") {
        await confirmEmailOtp(clean);
      } else {
        await confirmPhoneOtp(clean);
      }

      await refreshMe();
      Alert.alert("Verified ✅", "You’re all set!");
      close();
    } catch (e: any) {
      Alert.alert("Couldn’t verify", e?.message || "Invalid or expired code.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator />
        <Text style={{ color: MUTED, marginTop: 10 }}>Loading…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BG }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.8 },
            ]}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={22} color={TEXT} />
          </Pressable>

          <Text style={styles.headerTitle}>Verification</Text>
          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.infoText}>
          Verify your account to increase trust and unlock more features.
        </Text>

        {/* Email card */}
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.cardTopLeft}>
              <View style={styles.iconPill}>
                <Ionicons name="mail-outline" size={18} color={ACCENT} />
              </View>
              <View>
                <Text style={styles.cardTitle}>Email</Text>
                <Text style={styles.cardHint}>
                  {me?.email || "Add an email in your profile"}
                </Text>
              </View>
            </View>

            <StatusChip ok={emailVerified} />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
              emailVerified && styles.disabledBtn,
            ]}
            onPress={() => !emailVerified && start("email")}
            disabled={emailVerified}
          >
            <Text style={styles.primaryBtnText}>
              {emailVerified ? "Verified" : "Verify email"}
            </Text>
          </Pressable>
        </View>

        {/* Phone card */}
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.cardTopLeft}>
              <View style={styles.iconPill}>
                <Ionicons name="call-outline" size={18} color={ACCENT} />
              </View>
              <View>
                <Text style={styles.cardTitle}>Phone</Text>
                <Text style={styles.cardHint}>
                  {me?.phone || "Add a phone number"}
                </Text>
              </View>
            </View>

            <StatusChip ok={phoneVerified} />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
              phoneVerified && styles.disabledBtn,
            ]}
            onPress={() => !phoneVerified && start("phone")}
            disabled={phoneVerified}
          >
            <Text style={styles.primaryBtnText}>
              {phoneVerified ? "Verified" : "Verify phone"}
            </Text>
          </Pressable>

          <Text style={styles.subtleNote}>
            Phone OTP needs an SMS provider (Twilio, Termii, etc.). Email
            verification works with SendGrid.
          </Text>
        </View>

        <View style={{ height: 28 }} />

        {/* Modal */}
        <Modal
          visible={open}
          transparent
          animationType="fade"
          onRequestClose={close}
        >
          <Pressable style={styles.modalOverlay} onPress={close}>
            <Pressable style={styles.modalCard} onPress={() => {}}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{title}</Text>
                <Pressable onPress={close} hitSlop={10}>
                  <Ionicons
                    name="close"
                    size={22}
                    color="rgba(255,255,255,0.75)"
                  />
                </Pressable>
              </View>

              {step === "enter" ? (
                <>
                  <Text style={styles.modalHint}>
                    {mode === "email"
                      ? "We’ll send a code to your email."
                      : "We’ll send a code to your phone."}
                  </Text>

                  {mode === "email" ? (
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      style={styles.modalInput}
                      placeholder="you@example.com"
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      returnKeyType="send"
                      onSubmitEditing={sendOtp}
                    />
                  ) : (
                    <TextInput
                      value={phone}
                      onChangeText={setPhone}
                      style={styles.modalInput}
                      placeholder="+234…"
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      keyboardType="phone-pad"
                      returnKeyType="send"
                      onSubmitEditing={sendOtp}
                    />
                  )}

                  <Pressable
                    style={({ pressed }) => [
                      styles.modalBtn,
                      pressed && {
                        opacity: 0.92,
                        transform: [{ scale: 0.99 }],
                      },
                      busy && { opacity: 0.6 },
                    ]}
                    onPress={sendOtp}
                    disabled={busy}
                  >
                    {busy ? (
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <ActivityIndicator />
                        <Text style={styles.modalBtnText}>Sending…</Text>
                      </View>
                    ) : (
                      <Text style={styles.modalBtnText}>Send code</Text>
                    )}
                  </Pressable>
                </>
              ) : (
                <>
                  <Text style={styles.modalHint}>
                    Enter the code you received.
                  </Text>

                  <TextInput
                    value={code}
                    onChangeText={setCode}
                    style={styles.modalInput}
                    placeholder="123456"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    keyboardType="number-pad"
                    returnKeyType="done"
                    onSubmitEditing={confirmOtp}
                  />

                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.secondaryBtn,
                        pressed && {
                          opacity: 0.92,
                          transform: [{ scale: 0.99 }],
                        },
                      ]}
                      onPress={() => setStep("enter")}
                    >
                      <Text style={styles.secondaryBtnText}>Back</Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.modalBtn,
                        pressed && {
                          opacity: 0.92,
                          transform: [{ scale: 0.99 }],
                        },
                        busy && { opacity: 0.6 },
                      ]}
                      onPress={confirmOtp}
                      disabled={busy}
                    >
                      {busy ? (
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            alignItems: "center",
                          }}
                        >
                          <ActivityIndicator />
                          <Text style={styles.modalBtnText}>Verifying…</Text>
                        </View>
                      ) : (
                        <Text style={styles.modalBtnText}>Verify</Text>
                      )}
                    </Pressable>
                  </View>
                </>
              )}
            </Pressable>
          </Pressable>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function StatusChip({ ok }: { ok: boolean }) {
  return (
    <View style={[styles.chip, ok ? styles.chipOk : styles.chipNo]}>
      <Text style={styles.chipText}>{ok ? "Verified" : "Not verified"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, paddingTop: 55, paddingHorizontal: 10 },
  content: { paddingTop: 18, paddingHorizontal: 16 },
  center: { justifyContent: "center", alignItems: "center" },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: ACCENT,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.2,
    fontFamily: "serif",
  },
  infoText: { color: MUTED, fontSize: 13, marginBottom: 16 },

  card: {
    backgroundColor: CARD,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTopLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconPill: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(234,208,247,0.12)",
    borderWidth: 1,
    borderColor: "rgba(234,208,247,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { color: TEXT, fontSize: 15, fontWeight: "900" },
  cardHint: { color: MUTED, fontSize: 12.5, marginTop: 2 },

  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipOk: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderColor: "rgba(34,197,94,0.25)",
  },
  chipNo: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.12)",
  },
  chipText: { color: TEXT, fontSize: 12, fontWeight: "800" },

  primaryBtn: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(234,208,247,0.35)",
    backgroundColor: "rgba(234,208,247,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledBtn: { opacity: 0.55 },
  primaryBtnText: {
    color: TEXT,
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 0.3,
  },

  subtleNote: { color: "rgba(255,255,255,0.45)", fontSize: 12, marginTop: 10 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 16,
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: "rgba(10,14,30,0.98)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    height: 200,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    color: ACCENT,
    fontSize: 18,
    fontWeight: "900",
    fontFamily: "serif",
  },
  modalHint: { color: MUTED, fontSize: 13, marginBottom: 12 },

  modalInput: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: TEXT,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    marginBottom: 12,
  },

  modalBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(234,208,247,0.35)",
    backgroundColor: "rgba(234,208,247,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnText: { color: TEXT, fontWeight: "900", fontSize: 14 },

  secondaryBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: { color: TEXT, fontWeight: "900", fontSize: 14 },
});
