import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { resetPasswordWithCode } from "../api"; // adjust path

const BG = "#070A17";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(255,255,255,0.10)";
const TEXT = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.68)";
const ACCENT = "#EAD0F7";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const prefilledEmail = typeof params.email === "string" ? params.email : "";

  const [email, setEmail] = useState(prefilledEmail);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !code.trim() || !newPassword || !confirm) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (newPassword !== confirm) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Too short", "Password should be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordWithCode({
        email: cleanEmail,
        code: code.trim(),
        newPassword,
      });

      Alert.alert("Success ✨", "Password reset successfully. Please log in.");
      router.replace("/"); // or "/auth/login" depending on your routing
    } catch (e: any) {
      Alert.alert("Couldn’t reset", e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
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
        showsVerticalScrollIndicator={false}
      >
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

          <Text style={styles.headerTitle}>Reset Password</Text>
          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.infoText}>
          Enter the code sent to your email, then choose a new password. Check your spam folder if you don't see it.
        </Text>

        <View style={styles.card}>
          <Label text="Email" />
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="rgba(255,255,255,0.35)"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Label text="Reset code" />
          <TextInput
            value={code}
            onChangeText={setCode}
            style={styles.input}
            placeholder="e.g. 123456"
            placeholderTextColor="rgba(255,255,255,0.35)"
            keyboardType="number-pad"
          />

          <Label text="New password" />
          <PasswordRow
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            setShow={setShowNew}
            placeholder="New password"
          />

          <Label text="Confirm password" />
          <PasswordRow
            value={confirm}
            onChange={setConfirm}
            show={showConfirm}
            setShow={setShowConfirm}
            placeholder="Confirm password"
          />

          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
              loading && { opacity: 0.6 },
            ]}
            onPress={handleReset}
            disabled={loading}
          >
            {loading ? (
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                <ActivityIndicator />
                <Text style={styles.primaryBtnText}>Resetting…</Text>
              </View>
            ) : (
              <Text style={styles.primaryBtnText}>Reset password</Text>
            )}
          </Pressable>
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Label({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>;
}

function PasswordRow({ value, onChange, show, setShow, placeholder }: any) {
  return (
    <View style={styles.passwordRow}>
      <TextInput
        style={[styles.inputField, { borderWidth: 0 }]}
        value={value}
        onChangeText={onChange}
        secureTextEntry={!show}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.35)"
      />
      <Pressable onPress={() => setShow(!show)} hitSlop={10}>
        <Ionicons
          name={show ? "eye-off-outline" : "eye-outline"}
          size={20}
          color="rgba(255,255,255,0.55)"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, paddingTop: 55, paddingHorizontal: 10 },
  content: { paddingTop: 18, paddingHorizontal: 16 },

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
  },
  label: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: TEXT,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: 12,
  },
  inputField: { flex: 1, color: TEXT, height: 46 },

  primaryBtn: {
    marginTop: 16,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(234,208,247,0.35)",
    backgroundColor: "rgba(234,208,247,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: TEXT,
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
