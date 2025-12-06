import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CARD_BG = "rgba(15,23,42,0.95)";

export default function BlockedUsers() {
  const router = useRouter();
  const [blocked, setBlocked] = useState(["John Doe", "Jane Smith"]);

  const handleUnblock = (user: string) => {
    Alert.alert("Unblock User", `Are you sure you want to unblock ${user}?`, [
      { text: "Cancel" },
      { text: "Yes", onPress: () => setBlocked(blocked.filter(u => u !== user)) },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="arrow-back" size={24} color="#E5E7EB" onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Blocked Users</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        {blocked.length === 0 ? (
          <Text style={{ color: "#A1A1AA", textAlign: "center" }}>No blocked users</Text>
        ) : (
          blocked.map((user, i) => (
            <View key={i} style={styles.userRow}>
              <Text style={styles.userName}>{user}</Text>
              <Pressable style={styles.unblockBtn} onPress={() => handleUnblock(user)}>
                <Text style={styles.unblockText}>Unblock</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617", paddingTop: 55, paddingHorizontal: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  headerTitle: { color: "#F9FAFB", fontSize: 22, fontWeight: "700" },
  section: { backgroundColor: CARD_BG, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "rgba(148,163,184,0.35)" },
  userRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  userName: { color: "#F9FAFB", fontSize: 14 },
  unblockBtn: { backgroundColor: "#EC4899", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  unblockText: { color: "#fff", fontWeight: "600" },
});
