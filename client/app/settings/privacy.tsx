import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.text}>
        Your privacy matters to us. Amoura is built to help people connect
        safely and respectfully, and protecting your personal information is a
        core part of that mission.
      </Text>

      <Text style={styles.section}>What we collect</Text>
      <Text style={styles.text}>
        We collect information you provide such as your name, photos, bio,
        preferences, and activity within the app. This helps us personalize your
        experience and suggest better matches.
      </Text>

      <Text style={styles.section}>How we use your data</Text>
      <Text style={styles.text}>
        Your data is used to operate the app, improve matching, ensure safety,
        and prevent abuse. We do not sell your personal information.
      </Text>

      <Text style={styles.section}>Your control</Text>
      <Text style={styles.text}>
        You can edit your profile, control visibility, or delete your account at
        any time from settings.
      </Text>

      <Text style={styles.footer}>
        If you have questions about privacy, please contact support through the
        app.
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