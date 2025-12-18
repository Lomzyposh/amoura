import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const BG = "#070A17";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(255,255,255,0.10)";
const TEXT = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.68)";
const ACCENT = "#EAD0F7";

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => router.replace("/"),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete account",
      "This action is permanent. Your profile, matches, and chats will be removed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => console.log("TODO: call delete endpoint"),
        },
      ]
    );
  };

  const Section = ({ title, children }: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );

  const Row = ({ label, icon, hint, onPress, danger }: any) => (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
      ]}
      onPress={onPress}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.iconPill, danger && styles.iconPillDanger]}>
          <Ionicons
            name={icon}
            size={18}
            color={danger ? "rgba(255,90,90,0.95)" : ACCENT}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>
            {label}
          </Text>
          {!!hint && <Text style={styles.rowHint}>{hint}</Text>}
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="rgba(255,255,255,0.35)"
      />
    </Pressable>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={22} color={TEXT} />
        </Pressable>

        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Account */}
      <Section title="Account">
        <Row
          label="Edit profile"
          hint="Photos, bio, preferences"
          icon="person-outline"
          onPress={() => router.push("/settings/edit-profile")}
        />
        <Row
          label="Change password"
          hint="Update your login password"
          icon="lock-closed-outline"
          onPress={() => router.push("/settings/change-password")}
        />
        <Row
          label="Verification"
          hint="Increase trust on your profile"
          icon="shield-checkmark-outline"
          onPress={() => router.push("/settings/verification")}
        />
      </Section>

      {/* Privacy & Safety */}
      <Section title="Privacy & Safety">
        <Row
          label="Blocked users"
          hint="Manage people you blocked"
          icon="remove-circle-outline"
          onPress={() => router.push("/settings/blocked-users")}
        />
        <Row
          label="Report an Issue"
          hint="Help keep Amoura safe"
          icon="flag-outline"
          onPress={() => router.push("/settings/report-user")}
        />
        <Row
          label="Safety tips"
          hint="Meet safely and smartly"
          icon="help-circle-outline"
          onPress={() => router.push("/settings/safety-tips")}
        />
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <Row
          label="Notification settings"
          hint="Matches, likes, and messages"
          icon="notifications-outline"
          onPress={() => router.push("/settings/notifications")}
        />
      </Section>

      {/* Legal */}
      <Section title="Legal">
        <Row
          label="Privacy policy"
          icon="shield-outline"
          onPress={() => router.push("/settings/privacy")}
        />
        <Row
          label="Terms & conditions"
          icon="document-text-outline"
          onPress={() => router.push("/settings/terms")}
        />
        <Row
          label="Community guidelines"
          icon="book-outline"
          onPress={() => router.push("/settings/guidelines")}
        />
      </Section>

      {/* Danger zone */}
      <View style={styles.dangerZone}>
        <Text style={styles.dangerTitle}>Danger zone</Text>

        <Pressable
          style={({ pressed }) => [
            styles.dangerBtn,
            pressed && { opacity: 0.9 },
          ]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color={TEXT} />
          <Text style={styles.dangerBtnText}>Log out</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.deleteBtn,
            pressed && { opacity: 0.9 },
          ]}
          onPress={handleDeleteAccount}
        >
          <Ionicons name="trash-outline" size={18} color="#FFF" />
          <Text style={styles.deleteBtnText}>Delete account</Text>
        </Pressable>
      </View>

      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: 55,
    paddingHorizontal: 10,
  },
  content: {
    paddingTop: 18,
    paddingHorizontal: 16,
  },

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

  section: {
    marginTop: 12,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 10,
    marginLeft: 4,
  },
  sectionBody: {
    backgroundColor: CARD,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
  },

  row: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  iconPill: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(234,208,247,0.12)",
    borderWidth: 1,
    borderColor: "rgba(234,208,247,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconPillDanger: {
    backgroundColor: "rgba(255,90,90,0.12)",
    borderColor: "rgba(255,90,90,0.22)",
  },
  rowLabel: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "800",
  },
  rowLabelDanger: {
    color: "rgba(255,120,120,0.95)",
  },
  rowHint: {
    marginTop: 2,
    color: MUTED,
    fontSize: 12.5,
    lineHeight: 16,
  },

  dangerZone: {
    marginTop: 18,
    marginBottom: 30,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,90,90,0.20)",
    backgroundColor: "rgba(255,90,90,0.06)",
  },
  dangerTitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  dangerBtn: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.06)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  dangerBtnText: {
    color: TEXT,
    fontWeight: "900",
    fontSize: 14,
  },
  deleteBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,90,90,0.85)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  deleteBtnText: {
    color: "#FFF",
    fontWeight: "900",
    fontSize: 14,
  },
});
