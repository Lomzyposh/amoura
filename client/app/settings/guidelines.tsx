import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function GuidelinesScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.title}>Community Guidelines</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.text}>
        Amoura is a space for meaningful and respectful connections. These
        guidelines help keep the community safe and welcoming.
      </Text>

      <Text style={styles.section}>Be respectful</Text>
      <Text style={styles.text}>
        Harassment, hate speech, threats, or discrimination are not allowed.
        Treat people the way you’d want to be treated.
      </Text>

      <Text style={styles.section}>Be authentic</Text>
      <Text style={styles.text}>
        Use real photos and honest information. Impersonation and misleading
        profiles are not permitted.
      </Text>

      <Text style={styles.section}>Stay safe</Text>
      <Text style={styles.text}>
        Do not share sensitive personal information too quickly. Report
        suspicious behavior directly from the app.
      </Text>

      <Text style={styles.footer}>
        Violations may result in warnings, suspension, or permanent removal.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070A17",
    paddingTop: 55,
    paddingHorizontal: 10,
  },
  content: {
    padding: 18,
    paddingBottom: 32,
  },
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
  },
  title: {
    color: "#EAD0F7",
    fontSize: 22,
    fontWeight: "900",
    fontFamily: "serif",
  },
  section: {
    marginTop: 18,
    marginBottom: 6,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  text: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    marginTop: 24,
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
  },
});
