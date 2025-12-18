import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createReport } from "../api"; // adjust path

const BG = "#070A17";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(255,255,255,0.12)";
const TEXT = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.7)";
const ACCENT = "#EAD0F7";

const REPORT_REASONS = [
  "Harassment or bullying",
  "Inappropriate messages",
  "Fake profile or impersonation",
  "Hate speech or discrimination",
  "Scam or suspicious behavior",
  "Nudity or sexual content",
  "Other",
];

export default function ReportUserScreen() {
  const router = useRouter();

  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!selected) {
      Alert.alert("Select a reason", "Please choose a reason for reporting.");
      return;
    }

    try {
      setSending(true);

      await createReport({
        reason: selected,
        note: note.trim(),
      });

      Alert.alert(
        "Report sent",
        "Thank you for helping keep Amoura safe. We’ll review this report.",
        [{ text: "Done", onPress: () => router.back() }]
      );
    } catch (e: any) {
      Alert.alert("Couldn’t send", e?.message || "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

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
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={TEXT} />
          </Pressable>
          <Text style={styles.title}>Report an Issue</Text>
          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.intro}>
          We’re sorry you had this experience. Please tell us what happened so
          we we can take appropriate action.
        </Text>

        {/* Reasons */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Reason</Text>

          {REPORT_REASONS.map((reason) => {
            const active = selected === reason;
            return (
              <Pressable
                key={reason}
                onPress={() => setSelected(reason)}
                style={[styles.reasonRow, active && styles.reasonRowActive]}
              >
                <Text
                  style={[styles.reasonText, active && styles.reasonTextActive]}
                >
                  {reason}
                </Text>

                {active && (
                  <Ionicons name="checkmark-circle" size={18} color={ACCENT} />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Optional note */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Additional details (optional)</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add any context that may help us understand the issue…"
            placeholderTextColor="rgba(255,255,255,0.4)"
            multiline
            style={styles.textArea}
            textAlignVertical="top"
          />
        </View>

        {/* Submit */}
        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            pressed && { opacity: 0.9 },
            sending && { opacity: 0.6 },
          ]}
          onPress={handleSubmit}
          disabled={sending}
        >
          {sending ? (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <ActivityIndicator />
              <Text style={styles.submitText}>Submitting…</Text>
            </View>
          ) : (
            <>
              <Ionicons name="flag-outline" size={18} color="#000" />
              <Text style={styles.submitText}>Submit report</Text>
            </>
          )}
        </Pressable>

        <Text style={styles.footer}>
          Reports are confidential. Repeated false reports may lead to account
          restrictions.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, paddingTop: 55, paddingHorizontal: 10 },
  content: { padding: 18, paddingBottom: 32 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: BORDER,
  },
  title: {
    color: ACCENT,
    fontSize: 22,
    fontWeight: "900",
    fontFamily: "serif",
  },

  intro: { color: MUTED, fontSize: 14, lineHeight: 20, marginBottom: 18 },

  card: {
    backgroundColor: CARD,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 16,
  },

  sectionTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 10,
  },

  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  reasonRowActive: {
    backgroundColor: "rgba(234,208,247,0.08)",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  reasonText: { color: TEXT, fontSize: 14 },
  reasonTextActive: { color: ACCENT, fontWeight: "800" },

  textArea: {
    minHeight: 110,
    color: TEXT,
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  submitBtn: {
    marginTop: 8,
    height: 52,
    borderRadius: 16,
    backgroundColor: ACCENT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  submitText: { color: "#000", fontWeight: "900", fontSize: 14 },

  footer: {
    marginTop: 14,
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
