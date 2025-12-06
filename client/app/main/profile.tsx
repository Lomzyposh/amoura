import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

interface StoredUser {
  name?: string;
  email?: string;
  gender?: string;
  interests?: string[];
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem("amoura_user");
        if (raw) {
          setUser(JSON.parse(raw));
        }
      } catch (err) {
        console.log("Failed to load user from storage:", err);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("amoura_token");
      await AsyncStorage.removeItem("amoura_user");
      router.replace("/screens/login");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "A";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Ionicons name="settings-outline" size={22} color="#E5E7EB" />
      </View>

      {/* Avatar + basic info */}
      <View style={styles.topCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <Text style={styles.nameText}>
          {user?.name || "Amoura User"}
        </Text>
        <Text style={styles.subText}>
          {user?.email || "no-email@amoura.app"}
        </Text>

        <View style={styles.chipRow}>
          {user?.gender && (
            <View style={styles.chip}>
              <Ionicons name="male-female-outline" size={14} color="#F9FAFB" />
              <Text style={styles.chipText}>{user.gender}</Text>
            </View>
          )}

          {user?.interests && user.interests.length > 0 && (
            <View style={styles.chip}>
              <Ionicons name="musical-notes-outline" size={14} color="#F9FAFB" />
              <Text style={styles.chipText}>
                {user.interests.slice(0, 2).join(" • ")}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Stats row (dummy for now) */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>105</Text>
          <Text style={styles.statLabel}>Likes</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>New</Text>
        </View>
      </View>

      {/* Simple sections (placeholders) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.rowItem}>
          <Ionicons name="mail-outline" size={20} color="#E5E7EB" />
          <View style={styles.rowTextWrap}>
            <Text style={styles.rowTitle}>Email</Text>
            <Text style={styles.rowSubtitle}>
              {user?.email || "Add your email"}
            </Text>
          </View>
        </View>

        <View style={styles.rowItem}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#E5E7EB" />
          <View style={styles.rowTextWrap}>
            <Text style={styles.rowTitle}>Safety & Privacy</Text>
            <Text style={styles.rowSubtitle}>
              Manage who can see your profile and matches.
            </Text>
          </View>
        </View>
      </View>

      {/* Logout button */}
      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#F9FAFB" />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const CARD_BG = "rgba(15,23,42,0.95)";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#F9FAFB",
  },
  topCard: {
    backgroundColor: CARD_BG,
    borderRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.5)",
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 2,
    borderColor: "#EC4899",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: "700",
    color: "#F9FAFB",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 2,
  },
  subText: {
    fontSize: 13,
    color: "rgba(209,213,219,0.9)",
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.9)",
  },
  chipText: {
    color: "#F9FAFB",
    fontSize: 12,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F9FAFB",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(148,163,184,0.95)",
  },
  section: {
    marginTop: 18,
    backgroundColor: CARD_BG,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  sectionTitle: {
    color: "#E5E7EB",
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 14,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  rowTextWrap: {
    marginLeft: 10,
    flex: 1,
  },
  rowTitle: {
    color: "#F9FAFB",
    fontSize: 14,
    fontWeight: "500",
  },
  rowSubtitle: {
    color: "rgba(148,163,184,0.95)",
    fontSize: 12,
    marginTop: 2,
  },
  logoutBtn: {
    marginTop: 24,
    width: "100%",
    height: 52,
    borderRadius: 18,
    backgroundColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "600",
  },
});
