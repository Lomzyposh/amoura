import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

type User = {
  _id: string;
  name?: string;
  age?: number;
  photos?: { url: string; order?: number }[];
};

async function getToken() {
  return AsyncStorage.getItem("amoura_token");
}

function mainPhoto(u: User) {
  return (
    u.photos?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0]?.url ||
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
  );
}

export default function LikeYouScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchLikes = async () => {
    setErr("");
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/likes/you`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      const text = await res.text();
      if (!text.trim().startsWith("{")) {
        throw new Error("Server returned invalid response");
      }

      const data = JSON.parse(text);
      setUsers(data.users || []);
    } catch (e: any) {
      setErr(e.message || "Failed to load likes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Loading likes…</Text>
      </View>
    );
  }

  if (users.length === 0) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Like You</Text>
        <Text style={styles.empty}>
          No one has liked you yet — check back soon 💫
        </Text>
        <Pressable onPress={fetchLikes} style={styles.refreshBtn}>
          <Text style={styles.refreshBtnText}>⟳</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Like You</Text>
        <Pressable onPress={fetchLikes} style={styles.refreshBtn}>
          <Text style={styles.refreshBtnText}>⟳</Text>
        </Pressable>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ gap: 14 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <Pressable style={styles.card}>
            <Image source={{ uri: mainPhoto(item) }} style={styles.image} />
            <View style={styles.overlay} />
            <View style={styles.footer}>
              <Text style={styles.name}>
                {item.name ?? "Someone"}, {item.age ?? "—"}
              </Text>
            </View>
          </Pressable>
        )}
      />

      {!!err && <Text style={styles.err}>{err}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070A17",
    paddingTop: 55,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    backgroundColor: "#070A17",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#EAD0F7",
  },
  refreshBtn: {
    padding: 8,
  },
  refreshBtnText: {
    fontSize: 30,
    color: "#EAD0F7",
  },
  muted: {
    marginTop: 10,
    color: "rgba(255,255,255,0.75)",
  },
  empty: {
    marginTop: 10,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
  },
  card: {
    flex: 1,
    height: 220,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  footer: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 10,
  },
  name: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },
  err: {
    marginTop: 10,
    color: "rgba(255,120,120,0.9)",
    textAlign: "center",
  },
});
