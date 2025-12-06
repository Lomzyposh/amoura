import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CARD_BG = "rgba(15,23,42,0.95)";

export default function ChangePasswordScreen() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirmation do not match.");
      return;
    }

    // TODO: Call backend API to update password
    Alert.alert("Success", "Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#E5E7EB" />
        </Pressable>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Instructions */}
      <Text style={styles.infoText}>
        Update your password for better account security.
      </Text>

      {/* Form Card */}
      <View style={styles.formCard}>
        <PasswordInput
          label="Current Password"
          value={currentPassword}
          onChange={setCurrentPassword}
          show={showCurrent}
          setShow={setShowCurrent}
        />
        <PasswordInput
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          show={showNew}
          setShow={setShowNew}
        />
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          show={showConfirm}
          setShow={setShowConfirm}
        />

        <Pressable style={styles.saveBtn} onPress={handleSubmit}>
          <Text style={styles.saveBtnText}>Update Password</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

/* ========== PASSWORD INPUT COMPONENT ========== */
function PasswordInput({ label, value, onChange, show, setShow }: any) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.passwordRow}>
        <TextInput
          style={styles.inputField}
          value={value}
          onChangeText={onChange}
          secureTextEntry={!show}
          placeholder={label}
          placeholderTextColor="rgba(209,213,219,0.5)"
        />
        <Pressable onPress={() => setShow(!show)}>
          <Ionicons
            name={show ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#A1A1AA"
          />
        </Pressable>
      </View>
    </View>
  );
}

/* ========== STYLES ========== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingTop: 55,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    color: "#F9FAFB",
    fontSize: 22,
    fontWeight: "700",
  },
  infoText: {
    color: "#A1A1AA",
    fontSize: 13,
    marginBottom: 16,
  },
  formCard: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.35)",
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#E5E7EB",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30,41,59,0.8)",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.35)",
  },
  inputField: {
    flex: 1,
    color: "#F9FAFB",
    height: 44,
  },
  saveBtn: {
    marginTop: 16,
    backgroundColor: "#EC4899",
    height: 50,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: "#F9FAFB",
    fontWeight: "700",
    fontSize: 16,
  },
});
