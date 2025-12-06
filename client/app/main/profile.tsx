import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

interface StoredUser {
  name?: string;
  email?: string;
  gender?: string;
  bio?: string;
  age?: number;
  location?: string;
  hobbies?: string[];
  interests?: string[];
  lookingFor?: string;
  gallery?: string[]; // image URLs
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
        console.log("Failed to load user:", err);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("amoura_token");
      await AsyncStorage.removeItem("amoura_user");
      router.replace("/");
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
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Profile</Text>

        <Pressable onPress={() => router.push("/settings/settings")}>
          <Ionicons name="settings-outline" size={24} color="#E5E7EB" />
        </Pressable>
      </View>

      {/* PROFILE HEADER */}
      <View style={styles.topCard}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <Pressable style={styles.editPhotoBtn}>
            <Ionicons name="camera-outline" size={16} color="#fff" />
          </Pressable>
        </View>

        <Text style={styles.nameText}>{user?.name || "Amoura User"}</Text>

        {user?.age && (
          <Text style={styles.ageText}>{user.age} years old</Text>
        )}

        <Text style={styles.subText}>
          {user?.bio || "Add a short bio about yourself"}
        </Text>

        {user?.location && (
          <Text style={styles.locationText}>
            <Ionicons name="location-outline" size={14} color="#EC4899" />{" "}
            {user.location}
          </Text>
        )}
      </View>

      {/* QUICK STATS */}
      <View style={styles.statsRow}>
        <StatBox value="105" label="Likes" />
        <StatBox value="24" label="Matches" />
        <StatBox value="Joined" label="2025" />
      </View>

      {/* GALLERY SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Add Photo */}
          <Pressable style={styles.addPhotoBox}>
            <Ionicons name="add" size={28} color="#fff" />
          </Pressable>

          {/* Loaded photos */}
          {user?.gallery?.map((img, i) => (
            <Image key={i} source={{ uri: img }} style={styles.galleryImage} />
          ))}
        </ScrollView>
      </View>

      {/* PERSONAL DETAILS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Details</Text>

        <DetailRow icon="person-outline" label="Name" value={user?.name} />
        <DetailRow icon="calendar-outline" label="Age" value={user?.age?.toString()} />
        <DetailRow icon="male-female-outline" label="Gender" value={user?.gender} />
        <DetailRow icon="heart-outline" label="Interests" value={user?.interests?.join(", ")} />
        <DetailRow icon="book-outline" label="About Me" value={user?.bio} />
        <DetailRow icon="walk-outline" label="Hobbies" value={user?.hobbies?.join(", ")} />
        <DetailRow icon="search-outline" label="Looking For" value={user?.lookingFor} />
      </View>

      {/* PROFILE PROMPTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Prompts</Text>

        <PromptItem text="Two truths and a lie" />
        <PromptItem text="My perfect date is…" />
        <PromptItem text="The first thing people notice about me…" />
      </View>

      

      {/* LOGOUT */}
      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#F9FAFB" />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </ScrollView>
  );
}

/* ========== SMALL COMPONENTS ========== */

function DetailRow({ icon, label, value }: any) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={18} color="#E5E7EB" />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value || "Add info"}</Text>
      </View>
    </View>
  );
}

function PromptItem({ text }: any) {
  return (
    <View style={styles.promptBox}>
      <Text style={styles.promptText}>{text}</Text>
      <Ionicons name="chevron-forward" size={18} color="#A1A1AA" />
    </View>
  );
}

function StatBox({ value, label }: any) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/* ========== STYLES ========== */

const CARD_BG = "rgba(15,23,42,0.95)";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingTop: 55,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F9FAFB",
  },

  /* PROFILE HEADER */
  topCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 20,
    borderColor: "rgba(148,163,184,0.4)",
    borderWidth: 1,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 2,
    borderColor: "#EC4899",
    alignItems: "center",
    justifyContent: "center",
  },
  editPhotoBtn: {
    position: "absolute",
    bottom: -4,
    right: -6,
    backgroundColor: "#EC4899",
    padding: 6,
    borderRadius: 20,
  },
  avatarText: {
    fontSize: 34,
    fontWeight: "700",
    color: "#fff",
  },
  nameText: {
    fontSize: 22,
    color: "#F9FAFB",
    fontWeight: "700",
    marginTop: 10,
  },
  ageText: {
    fontSize: 14,
    color: "#D1D5DB",
    marginTop: 4,
  },
  subText: {
    fontSize: 13,
    color: "#A1A1AA",
    marginTop: 6,
    textAlign: "center",
  },
  locationText: {
    color: "#fff",
    marginTop: 6,
    fontSize: 13,
  },

  /* GALLERY */
  addPhotoBox: {
    width: 90,
    height: 110,
    backgroundColor: "rgba(30,41,59,0.8)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EC4899",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  galleryImage: {
    width: 90,
    height: 110,
    borderRadius: 16,
    marginRight: 10,
  },

  /* SECTIONS */
  section: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    color: "#E5E7EB",
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 14,
  },

  /* PERSONAL DETAILS */
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  detailLabel: {
    color: "#F9FAFB",
    fontSize: 14,
    marginBottom: 2,
  },
  detailValue: {
    color: "#A1A1AA",
    fontSize: 12,
  },

  /* PROMPTS */
  promptBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    alignItems: "center",
  },
  promptText: {
    color: "#F9FAFB",
    fontSize: 14,
  },

  /* QUICK STATS */
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  statBox: {
    width: "32%",
    backgroundColor: CARD_BG,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
  },
  statValue: {
    color: "#F9FAFB",
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    color: "#A1A1AA",
    fontSize: 12,
    marginTop: 4,
  },

  /* LOGOUT */
  logoutBtn: {
    backgroundColor: "#EF4444",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 18,
    marginBottom: 60,
    gap: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
