import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CARD_BG = "rgba(15,23,42,0.95)";
const tips = [
  "Always meet in public places.",
  "Never share personal information.",
  "Report suspicious accounts immediately.",
];

const reportReasons = ["Harassment", "Scam", "Nudity", "Fake Profile"];

export default function SafetyReportScreen() {
  const router = useRouter();

  const handleReport = (reason: string) => Alert.alert("Report User", `Reported for: ${reason}`);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="arrow-back" size={24} color="#E5E7EB" onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Safety & Reporting</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Safety Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Tips</Text>
        {tips.map((tip, i) => (
          <View key={i} style={styles.tipBox}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#EC4899" />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      {/* Report User */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Report User</Text>
        {reportReasons.map((reason, i) => (
          <Pressable key={i} style={styles.reportBtn} onPress={() => handleReport(reason)}>
            <Text style={styles.reportText}>{reason}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617", paddingTop: 55, paddingHorizontal: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  headerTitle: { color: "#F9FAFB", fontSize: 22, fontWeight: "700" },
  section: { backgroundColor: CARD_BG, borderRadius: 18, padding: 16, marginBottom: 18, borderWidth: 1, borderColor: "rgba(148,163,184,0.35)" },
  sectionTitle: { color: "#E5E7EB", fontSize: 15, fontWeight: "600", marginBottom: 12 },
  tipBox: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 8 },
  tipText: { color: "#F9FAFB", fontSize: 14 },
  reportBtn: { backgroundColor: "#EC4899", paddingVertical: 12, borderRadius: 12, marginBottom: 10, alignItems: "center" },
  reportText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
