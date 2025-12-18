import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function TermsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.title}>Terms & Conditions</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.text}>
        By using Amoura, you agree to follow these terms. They exist to keep the
        app safe, fair, and enjoyable for everyone.
      </Text>

      <Text style={styles.section}>Eligibility</Text>
      <Text style={styles.text}>
        You must be at least 18 years old to use Amoura. You are responsible for
        the accuracy of the information you provide.
      </Text>

      <Text style={styles.section}>User responsibility</Text>
      <Text style={styles.text}>
        You agree to treat others with respect, avoid harmful behavior, and
        follow community rules. Any misuse may result in account suspension or
        removal.
      </Text>

      <Text style={styles.section}>Account termination</Text>
      <Text style={styles.text}>
        We reserve the right to suspend or delete accounts that violate these
        terms or put others at risk.
      </Text>

      <Text style={styles.footer}>
        Continued use of Amoura means you accept these terms.
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
