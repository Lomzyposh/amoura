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
import { useRouter } from "expo-router";

const BG_IMAGE =
  "https://cdn.pixabay.com/photo/2017/07/31/18/11/people-2559659_1280.jpg";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const API_BASE = process.env.EXPO_PUBLIC_API_URL; // e.g. http://192.168.x.x:5000/api

  const handleSubmit = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      Alert.alert("Missing email", "Please enter the email you registered with.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      Alert.alert(
        "Check your email",
        "If an account exists with this email, a reset code has been sent.",
        [
          {
            text: "Continue",
            onPress: () =>
              router.push({
                pathname: "/screens/ResetCode",
                params: { email: cleanEmail },
              }),
          },
        ]
      );
    } catch (err: any) {
      console.log("Forgot password error:", err.message);
      Alert.alert("Error", err.message || "Unable to send reset code.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />

      <View style={styles.wrapper}>
        <View style={styles.card}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter the email linked to your Amoura account. We’ll send you a code to
            reset your password.
          </Text>

          {/* Email field */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={22}
              color="#E1BEE7"
              style={styles.icon}
            />
            <TextInput
              placeholder="Email address"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Submit button */}
          <Pressable
            disabled={submitting}
            onPress={handleSubmit}
            style={[styles.btn, submitting && { opacity: 0.6 }]}
          >
            {submitting ? (
              <ActivityIndicator color="#0B132B" />
            ) : (
              <Text style={styles.btnText}>Send Reset Code</Text>
            )}
          </Pressable>

          {/* Back to login */}
          <Pressable
            style={{ marginTop: 16 }}
            onPress={() => router.push("/screens/login")}
          >
            <Text style={styles.backText}>Back to Login</Text>
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
  backText: {
    color: "#E1BEE7",
    textAlign: "center",
    fontSize: 14,
  },
});