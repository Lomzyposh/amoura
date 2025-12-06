import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CARD_BG = "rgba(15,23,42,0.95)";

export default function VerificationScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleVerifyPhone = () => Alert.alert("Phone Verification", `OTP sent to ${phone}`);
  const handleVerifyEmail = () => Alert.alert("Email Verification", `OTP sent to ${email}`);
  const handleSubmitOTP = () => Alert.alert("Success", "Verification complete!");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#E5E7EB" />
        </Pressable>
        <Text style={styles.headerTitle}>Verification</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Phone verification */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phone Verification</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Enter phone number"
          placeholderTextColor="rgba(209,213,219,0.5)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Pressable style={styles.btn} onPress={handleVerifyPhone}>
          <Text style={styles.btnText}>Send OTP</Text>
        </Pressable>
      </View>

      {/* Email verification */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Email Verification</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Enter email"
          placeholderTextColor="rgba(209,213,219,0.5)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Pressable style={styles.btn} onPress={handleVerifyEmail}>
          <Text style={styles.btnText}>Send OTP</Text>
        </Pressable>
      </View>

      {/* OTP Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enter OTP</Text>
        <TextInput
          style={styles.inputField}
          placeholder="OTP"
          placeholderTextColor="rgba(209,213,219,0.5)"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
        />
        <Pressable style={styles.btn} onPress={handleSubmitOTP}>
          <Text style={styles.btnText}>Verify</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617", paddingTop: 55, paddingHorizontal: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  headerTitle: { color: "#F9FAFB", fontSize: 22, fontWeight: "700" },
  section: { backgroundColor: CARD_BG, borderRadius: 18, padding: 16, marginBottom: 18, borderWidth: 1, borderColor: "rgba(148,163,184,0.35)" },
  sectionTitle: { color: "#E5E7EB", fontSize: 15, fontWeight: "600", marginBottom: 12 },
  inputField: { backgroundColor: "rgba(30,41,59,0.8)", borderRadius: 12, paddingHorizontal: 12, color: "#F9FAFB", height: 44, marginBottom: 12 },
  btn: { backgroundColor: "#EC4899", height: 48, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  btnText: { color: "#F9FAFB", fontWeight: "700", fontSize: 16 },
});
