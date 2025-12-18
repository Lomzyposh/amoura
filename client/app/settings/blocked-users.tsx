import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getBlockedUsers, unblockUser } from "../api";

const BG = "#070A17";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(255,255,255,0.10)";
const TEXT = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.68)";
const ACCENT = "#EAD0F7";

export default function BlockedUsers() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [blocked, setBlocked] = useState<any[]>([]);

  const load = async () => {
    try {
      const data = await getBlockedUsers();
      setBlocked(data.blockedUsers || []);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to load blocked users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ Refresh when screen comes back into focus (good for "unblock elsewhere")
  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const confirmUnblock = (u: any) => {
    Alert.alert("Unblock user", `Unblock ${u.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Unblock",
        style: "destructive",
        onPress: () => doUnblock(u._id),
      },
    ]);
  };

  const doUnblock = async (userId: string) => {
    // optimistic UI
    const prev = blocked;
    setBusyId(userId);
    setBlocked((p) => p.filter((x) => x._id !== userId));

    try {
      await unblockUser(userId);
    } catch (e: any) {
      setBlocked(prev);
      Alert.alert("Couldn’t unblock", e?.message || "Try again");
    } finally {
      setBusyId(null);
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

        <Text style={styles.headerTitle}>Blocked users</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.infoText}>
        Blocked users won’t be able to message you or appear in your discovery.
      </Text>

      <View style={styles.card}>
        {loading ? (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ color: MUTED, marginTop: 10 }}>Loading…</Text>
          </View>
        ) : blocked.length === 0 ? (
          <View style={{ paddingVertical: 16 }}>
            <Text style={{ color: MUTED, textAlign: "center" }}>
              No blocked users
            </Text>
          </View>
        ) : (
          blocked.map((u) => (
            <View key={u._id} style={styles.userRow}>
              <View style={styles.left}>
                <View style={styles.avatar}>
                  {u.photo ? (
                    <Image
                      source={{ uri: u.photo }}
                      style={{ width: 44, height: 44, borderRadius: 14 }}
                    />
                  ) : (
                    <Ionicons
                      name="person"
                      size={22}
                      color="rgba(255,255,255,0.65)"
                    />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.userName}>{u.name}</Text>
                  {!!u.bio && (
                    <Text style={styles.userBio} numberOfLines={1}>
                      {u.bio}
                    </Text>
                  )}
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.unblockBtn,
                  pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
                  busyId === u._id && { opacity: 0.6 },
                ]}
                onPress={() => confirmUnblock(u)}
                disabled={busyId === u._id}
              >
                {busyId === u._id ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.unblockText}>Unblock</Text>
                )}
              </Pressable>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 28 }} />
    </ScrollView>
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
    fontFamily: "serif",
  },
  infoText: { color: MUTED, fontSize: 13, marginBottom: 12 },

  card: {
    backgroundColor: CARD,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  userName: { color: TEXT, fontSize: 15, fontWeight: "900" },
  userBio: { color: MUTED, fontSize: 12.5, marginTop: 2 },

  unblockBtn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(234,208,247,0.35)",
    backgroundColor: "rgba(234,208,247,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  unblockText: { color: TEXT, fontWeight: "900", fontSize: 13 },
});
