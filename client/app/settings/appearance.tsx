import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CARD_BG = "rgba(15,23,42,0.95)";

export default function AppearanceSettings() {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="arrow-back" size={24} color="#E5E7EB" onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Appearance</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Theme</Text>

        <OptionRow label="Light" selected={theme === "light"} onPress={() => setTheme("light")} />
        <OptionRow label="Dark" selected={theme === "dark"} onPress={() => setTheme("dark")} />
        <OptionRow label="System Default" selected={theme === "system"} onPress={() => setTheme("system")} />
      </View>
    </ScrollView>
  );
}

function OptionRow({ label, selected, onPress }: any) {
  return (
    <Pressable style={styles.optionRow} onPress={onPress}>
      <Text style={styles.optionLabel}>{label}</Text>
      {selected && <Ionicons name="checkmark" size={20} color="#EC4899" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617", paddingTop: 55, paddingHorizontal: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  headerTitle: { color: "#F9FAFB", fontSize: 22, fontWeight: "700" },
  section: { backgroundColor: CARD_BG, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "rgba(148,163,184,0.35)" },
  sectionTitle: { color: "#E5E7EB", fontSize: 15, fontWeight: "600", marginBottom: 12 },
  optionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  optionLabel: { color: "#F9FAFB", fontSize: 14 },
});
