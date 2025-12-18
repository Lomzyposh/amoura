import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getMe, patchMe } from "../api"; // adjust path

// Same as Settings theme
const BG = "#070A17";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(255,255,255,0.10)";
const TEXT = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.68)";
const ACCENT = "#EAD0F7";

export default function NotificationSettings() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    likes: true,
    matches: true,
    messages: true,
    followers: false,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const me = await getMe();
        const n = me?.notificationSettings || {};

        setSettings({
          likes: typeof n.likes === "boolean" ? n.likes : true,
          matches: typeof n.matches === "boolean" ? n.matches : true,
          messages: typeof n.messages === "boolean" ? n.messages : true,
          followers: typeof n.followers === "boolean" ? n.followers : false,
        });
      } catch (e: any) {
        Alert.alert("Error", e?.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const updateToggle = async (key: keyof typeof settings, value: boolean) => {
    // optimistic UI
    setSettings((p) => ({ ...p, [key]: value }));
    setSavingKey(key);

    try {
      await patchMe({
        notificationSettings: {
          ...settings,
          [key]: value,
        },
      });
    } catch (e: any) {
      // rollback
      setSettings((p) => ({ ...p, [key]: !value }));
      Alert.alert("Couldn’t save", e?.message || "Try again");
    } finally {
      setSavingKey(null);
    }
  };

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

        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.infoText}>
        Choose what you want to hear from Amoura. You can change this anytime.
      </Text>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Notification settings</Text>

        {loading ? (
          <View style={{ paddingVertical: 22, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ color: MUTED, marginTop: 10 }}>Loading…</Text>
          </View>
        ) : (
          <>
            <ToggleRow
              label="Likes"
              hint="When someone likes your profile"
              value={settings.likes}
              onValueChange={(v: boolean) => updateToggle("likes", v)}
              saving={savingKey === "likes"}
            />
            <ToggleRow
              label="Matches"
              hint="When you get a new match"
              value={settings.matches}
              onValueChange={(v: boolean) => updateToggle("matches", v)}
              saving={savingKey === "matches"}
            />
            <ToggleRow
              label="Messages"
              hint="When you receive a message"
              value={settings.messages}
              onValueChange={(v: boolean) => updateToggle("messages", v)}
              saving={savingKey === "messages"}
            />
            <ToggleRow
              label="New Followers"
              hint="If you later add followers feature"
              value={settings.followers}
              onValueChange={(v: boolean) => updateToggle("followers", v)}
              saving={savingKey === "followers"}
              last
            />
          </>
        )}
      </View>

      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

function ToggleRow({ label, hint, value, onValueChange, saving, last }: any) {
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {!!hint && <Text style={styles.rowHint}>{hint}</Text>}
      </View>

      {saving ? (
        <ActivityIndicator />
      ) : (
        <Switch
          trackColor={{
            false: "rgba(255,255,255,0.18)",
            true: "rgba(234,208,247,0.45)",
          }}
          thumbColor={value ? "#FFFFFF" : "#FFFFFF"}
          value={value}
          onValueChange={onValueChange}
        />
      )}
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
  infoText: { color: MUTED, fontSize: 13, marginBottom: 12 },

  card: {
    backgroundColor: CARD,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 10,
    marginLeft: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  rowLabel: { color: TEXT, fontSize: 15, fontWeight: "800" },
  rowHint: { marginTop: 3, color: MUTED, fontSize: 12.5, lineHeight: 16 },
});
