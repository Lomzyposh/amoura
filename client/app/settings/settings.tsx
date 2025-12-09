import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CARD_BG = "rgba(15,23,42,0.95)";

export default function SettingsScreen() {
  const router = useRouter();

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure? This action is permanent.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => console.log("Deleted") },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("amoura_token");
      await AsyncStorage.removeItem("amoura_user");
      router.replace("/");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  const SectionCard = ({ title, children }: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const RowItem = ({ label, icon, onPress }: any) => (
    <Pressable style={styles.rowItem} onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name={icon} size={20} color="#E5E7EB" />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#A1A1AA" />
    </Pressable>
  );

  const ToggleItem = ({ label, value, onChange }: any) => (
    <View style={styles.rowItem}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.replace("/main/profile")}>
          <Ionicons name="arrow-back" size={24} color="#E5E7EB" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* =============== ACCOUNT SETTINGS =============== */}
      <SectionCard title="Account Settings">
        <RowItem
          label="Edit Profile"
          icon="person-circle-outline"
          onPress={() => router.push("/settings/edit-profile")}
        />

        <RowItem
          label="Change Password"
          icon="lock-closed-outline"
          onPress={() => router.push("/settings/change-password")}
        />

        <RowItem
          label="Verification"
          icon="shield-checkmark-outline"
          onPress={() => router.push("/settings/verification")}
        />

        <RowItem
          label="Delete Account"
          icon="trash-outline"
          onPress={handleDeleteAccount}
        />

        <RowItem
          label="Log Out"
          icon="log-out-outline"
          onPress={handleLogout}
        />
      </SectionCard>

      {/* =============== PRIVACY SETTINGS =============== */}
      <SectionCard title="Privacy Settings">
        <RowItem
          label="Blocked Users"
          icon="remove-circle-outline"
          onPress={() => router.push("/settings/blocked-users")}
        />

        <ToggleItem label="Profile Visibility" value={true} onChange={() => {}} />

        <ToggleItem label="Hide Age" value={false} onChange={() => {}} />

        <ToggleItem label="Hide Distance" value={false} onChange={() => {}} />

        <ToggleItem label="Allow Usage Data" value={true} onChange={() => {}} />

        <ToggleItem
          label="Low Data Mode"
          value={false}
          onChange={() => {}}
        />
      </SectionCard>

      {/* =============== SAFETY SETTINGS =============== */}
      <SectionCard title="Safety & Reporting">
        <RowItem
          label="Report a User"
          icon="flag-outline"
          onPress={() => router.push("/settings/report-user")}
        />

        <RowItem
          label="Safety Tips"
          icon="help-circle-outline"
          onPress={() => router.push("/settings/safety-tips")}
        />

        <ToggleItem
          label="Image Safety Filter"
          value={true}
          onChange={() => {}}
        />

        <ToggleItem
          label="Nudity Protection AI"
          value={true}
          onChange={() => {}}
        />
      </SectionCard>

      {/* =============== APP SETTINGS =============== */}
      <SectionCard title="App Settings">
        <RowItem
          label="Notification Settings"
          icon="notifications-outline"
          onPress={() => router.push("/settings/notifications")}
        />

        <RowItem
          label="Language"
          icon="language-outline"
          onPress={() => router.push("/settings/language")}
        />

        <RowItem
          label="Appearance"
          icon="color-palette-outline"
          onPress={() => router.push("/settings/appearance")}
        />
      </SectionCard>

      {/* =============== LEGAL =============== */}
      <SectionCard title="Legal Documents">
        <RowItem
          label="Terms & Conditions"
          icon="document-text-outline"
          onPress={() => router.push("/settings/terms")}
        />

        <RowItem
          label="Privacy Policy"
          icon="shield-outline"
          onPress={() => router.push("/settings/privacy")}
        />

        <RowItem
          label="Community Guidelines"
          icon="book-outline"
          onPress={() => router.push("/settings/guidelines")}
        />
      </SectionCard>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

/* ======================================================
                      STYLES
====================================================== */

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

  section: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.35)",
  },

  sectionTitle: {
    color: "#E5E7EB",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },

  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },

  rowLabel: {
    marginLeft: 10,
    color: "#F9FAFB",
    fontSize: 14,
  },
});
