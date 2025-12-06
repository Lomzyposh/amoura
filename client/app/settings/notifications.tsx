import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CARD_BG = "rgba(15,23,42,0.95)";

export default function NotificationSettings() {
  const router = useRouter();
  const [likes, setLikes] = useState(true);
  const [matches, setMatches] = useState(true);
  const [messages, setMessages] = useState(true);
  const [followers, setFollowers] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="arrow-back" size={24} color="#E5E7EB" onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>

        <ToggleRow label="Likes" value={likes} onValueChange={setLikes} />
        <ToggleRow label="Matches" value={matches} onValueChange={setMatches} />
        <ToggleRow label="Messages" value={messages} onValueChange={setMessages} />
        <ToggleRow label="New Followers" value={followers} onValueChange={setFollowers} />
      </View>
    </ScrollView>
  );
}

function ToggleRow({ label, value, onValueChange }: any) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        trackColor={{ false: "#4B5563", true: "#EC4899" }}
        thumbColor="#F9FAFB"
        value={value}
        onValueChange={onValueChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617", paddingTop: 55, paddingHorizontal: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  headerTitle: { color: "#F9FAFB", fontSize: 22, fontWeight: "700" },
  section: { backgroundColor: CARD_BG, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "rgba(148,163,184,0.35)" },
  sectionTitle: { color: "#E5E7EB", fontSize: 15, fontWeight: "600", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  rowLabel: { color: "#F9FAFB", fontSize: 14 },
});
