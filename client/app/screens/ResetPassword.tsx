import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const BG_IMAGE =
  "https://cdn.pixabay.com/photo/2017/07/31/18/11/people-2559659_1280.jpg";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email, code } = useLocalSearchParams<{ email?: string; code?: string }>();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const API_BASE = process.env.EXPO_PUBLIC_API_URL;

  const handleReset = async () => {
    const cleanEmail = (email || "").toString().trim().toLowerCase();
    const cleanCode = (code || "").toString().trim();

    if (!cleanEmail || !cleanCode) {
      Alert.alert("Error", "Missing reset data. Please restart the reset process.");
      return;
    }

    if (!password || !confirm) {
      Alert.alert("Missing fields", "Please enter your new password twice.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          code: cleanCode,
          newPassword: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to reset password.");
      }

      Alert.alert("Success", "Your password has been reset. You can now log in.", [
        {
          text: "OK",
          onPress: () => router.replace("/screens/login"),
        },
      ]);
    } catch (err: any) {
      console.log("Reset password error:", err.message);
      Alert.alert("Error", err.message || "Error resetting password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />

      <View style={styles.wrapper}>
        <View style={styles.card}>
          <Text style={styles.title}>Set a New Password</Text>
          <Text style={styles.subtitle}>
            Choose a strong password to keep your Amoura account secure.
          </Text>

          {/* New password */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={22}
              color="#E1BEE7"
              style={styles.icon}
            />
            <TextInput
              placeholder="New password"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Confirm new password */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color="#E1BEE7"
              style={styles.icon}
            />
            <TextInput
              placeholder="Confirm password"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.input}
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
            />
          </View>

          {/* Reset button */}
          <Pressable
            disabled={submitting}
            onPress={handleReset}
            style={[styles.btn, submitting && { opacity: 0.6 }]}
          >
            {submitting ? (
              <ActivityIndicator color="#0B132B" />
            ) : (
              <Text style={styles.btnText}>Change Password</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.88)",
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 22,
    borderWidth: 2,
    borderColor: "rgba(225,190,231,0.35)",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "serif",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(229,231,235,0.9)",
    marginBottom: 22,
    lineHeight: 20,
  },
  inputWrapper: {
    width: "100%",
    height: 55,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#E1BEE7",
    backgroundColor: "rgba(15,23,42,0.95)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
  },
  btn: {
    width: "100%",
    height: 55,
    backgroundColor: "#E1BEE7",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  btnText: {
    color: "#0B132B",
    fontSize: 18,
    fontWeight: "700",
  },
});