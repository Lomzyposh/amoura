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

export default function ResetCodeScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const API_BASE = process.env.EXPO_PUBLIC_API_URL;

  const handleVerify = async () => {
    const cleanEmail = (email || "").toString().trim().toLowerCase();
    const cleanCode = code.trim();

    if (!cleanEmail || !cleanCode) {
      Alert.alert("Missing info", "Something went wrong. Please restart reset flow.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${API_BASE}/auth/verify-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          code: cleanCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid or expired code.");
      }

      // go to reset password, pass email + code
      router.push({
        pathname: "/screens/ResetPassword",
        params: { email: cleanEmail, code: cleanCode },
      });
    } catch (err: any) {
      console.log("Verify code error:", err.message);
      Alert.alert("Error", err.message || "Unable to verify code.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />

      <View style={styles.wrapper}>
        <View style={styles.card}>
          <Text style={styles.title}>Enter Reset Code</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{" "}
            <Text style={styles.highlight}>
              {email || "your email"}
            </Text>
            . Enter it below to continue.
          </Text>

          {/* Code only */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="key-outline"
              size={22}
              color="#E1BEE7"
              style={styles.icon}
            />
            <TextInput
              placeholder="6-digit code"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.input}
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
            />
          </View>

          {/* Verify button */}
          <Pressable
            disabled={submitting}
            onPress={handleVerify}
            style={[styles.btn, submitting && { opacity: 0.6 }]}
          >
            {submitting ? (
              <ActivityIndicator color="#0B132B" />
            ) : (
              <Text style={styles.btnText}>Verify Code</Text>
            )}
          </Pressable>

          {/* Option: restart */}
          <Pressable
            style={{ marginTop: 14 }}
            onPress={() => router.replace("/screens/ForgotPassword")}
          >
            <Text style={styles.backText}>Didn’t get a code? Try again</Text>
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
  highlight: {
    color: "#E1BEE7",
    fontWeight: "600",
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
    letterSpacing: 4,
    textAlign: "center",
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
  backText: {
    color: "#E1BEE7",
    textAlign: "center",
    fontSize: 14,
  },
});