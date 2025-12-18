import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  Animated,
  PanResponder,
  ActivityIndicator,
  StatusBar,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

/**
 * NOTE (Expo phone):
 * - localhost will NOT work on a physical phone.
 * - Use your PC IPv4 like: http://192.168.1.50:5000
 * - Or your Render URL: https://your-api.onrender.com
 */
const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

type DeckUser = {
  _id: string;
  name?: string;
  age?: number;
  bio?: string;
  photos?: { url: string; order?: number }[];
};

async function getToken() {
  return AsyncStorage.getItem("amoura_token");
}

// Make photos robust: supports absolute + relative URLs
function mainPhoto(u: DeckUser) {
  const p = (u.photos || [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0];

  if (!p?.url) {
    return "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg";
  }

  if (p.url.startsWith("http://") || p.url.startsWith("https://")) return p.url;

  const base = API_BASE.replace(/\/+$/, "");
  const path = p.url.startsWith("/") ? p.url : `/${p.url}`;
  return `${base}${path}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function HomeScreen() {
  const [deck, setDeck] = useState<DeckUser[]>([]);
  const [i, setI] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  const position = useRef(new Animated.ValueXY()).current;

  const current = deck[i];
  const next = deck[i + 1];

  // ---- swipe/animation tuning
  const SWIPE_X = 120;
  const SWIPE_Y = 120;

  const rotate = position.x.interpolate({
    inputRange: [-220, 0, 220],
    outputRange: ["-8deg", "0deg", "8deg"],
    extrapolate: "clamp",
  });

  const cardOpacity = position.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: [0.96, 1, 0.96],
    extrapolate: "clamp",
  });

  // Labels
  const likeOpacity = position.x.interpolate({
    inputRange: [30, 100, 170],
    outputRange: [0, 0.6, 1],
    extrapolate: "clamp",
  });

  const passOpacity = position.x.interpolate({
    inputRange: [-170, -100, -30],
    outputRange: [1, 0.6, 0],
    extrapolate: "clamp",
  });

  const superOpacity = position.y.interpolate({
    inputRange: [-170, -100, -12],
    outputRange: [1, 0.65, 0],
    extrapolate: "clamp",
  });

  // Next card subtle lift
  const nextCardScale = position.x.interpolate({
    inputRange: [-220, 0, 220],
    outputRange: [0.98, 1, 0.98],
    extrapolate: "clamp",
  });

  const nextCardTranslateY = position.x.interpolate({
    inputRange: [-220, 0, 220],
    outputRange: [12, 0, 12],
    extrapolate: "clamp",
  });

  const resetCard = () => position.setValue({ x: 0, y: 0 });

  // ---- safer fetch helper (prevents JSON parse "<" crash)
  const safeJson = async (res: Response) => {
    const text = await res.text();
    const trimmed = text.trim();

    if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
      const preview = trimmed.slice(0, 120);
      throw new Error(
        `Server returned non-JSON (${res.status}). Check API URL/route. Preview: ${preview}`
      );
    }
    return JSON.parse(trimmed);
  };

  const fetchDeck = async () => {
    setErr("");
    setLoading(true);
    try {
      const token = await getToken();

      const res = await fetch(`${API_BASE}/users/discover`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.message || "Failed to load deck");

      setDeck(Array.isArray(data.users) ? data.users : []);
      setI(0);
      resetCard();
    } catch (e: any) {
      setDeck([]);
      setErr(e?.message || "Could not load deck");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeck();
  }, []);

  const sendSwipe = async (
    toUser: string,
    direction: "like" | "pass" | "superlike"
  ) => {
    const token = await getToken();
    const res = await fetch(`${API_BASE}/swipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ toUser, direction }),
    });

    const data = await safeJson(res);
    if (!res.ok)
      throw new Error(data?.error || data?.message || "Swipe failed");

    return data;
  };

  const goNext = () => {
    setI((prev) => {
      const nextIndex = prev + 1;

      // Optional: if low, refresh
      if (nextIndex >= deck.length - 2) {
        fetchDeck();
      }

      return nextIndex;
    });
    resetCard();
  };

  const animateOff = (x: number, y: number, onDone: () => void) => {
    Animated.timing(position, {
      toValue: { x, y },
      duration: 240,
      useNativeDriver: true,
    }).start(onDone);
  };

  const handleDecision = async (
    direction: "like" | "pass" | "superlike",
    xOut: number,
    yOut: number
  ) => {
    if (!current || sending) return;
    setSending(true);
    setErr("");

    // Optimistic UI
    animateOff(xOut, yOut, () => {});

    try {
      await sendSwipe(current._id, direction);
      goNext();
    } catch (e: any) {
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
        friction: 6,
      }).start();

      setErr(e?.message || "Swipe failed. Check connection / token.");
    } finally {
      setSending(false);
    }
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > 6 || Math.abs(g.dy) > 6,

        onPanResponderMove: Animated.event(
          [null, { dx: position.x, dy: position.y }],
          { useNativeDriver: false }
        ),

        onPanResponderRelease: (_, g) => {
          const like = g.dx > SWIPE_X;
          const pass = g.dx < -SWIPE_X;
          const superlike = g.dy < -SWIPE_Y;

          if (like) return handleDecision("like", width + 260, g.dy);
          if (pass) return handleDecision("pass", -width - 260, g.dy);
          if (superlike)
            return handleDecision("superlike", g.dx, -height - 260);

          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            friction: 6,
          }).start();
        },
      }),
    [current?._id, sending]
  );

  // ---- UI states
  if (loading) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Loading recommendations…</Text>
      </View>
    );
  }

  if (!current) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.brand}>Amoura</Text>
        <Text style={styles.title}>No more profiles</Text>
        <Text style={styles.sub}>
          Refresh to check for new profiles around you.
        </Text>

        <Pressable style={styles.primaryBtn} onPress={fetchDeck}>
          <Text style={styles.primaryText}>Refresh</Text>
        </Pressable>

        {!!err && <Text style={styles.err}>{err}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Amoura</Text>
          <Text style={styles.headerHint}>Discover nearby profiles</Text>
        </View>

        <View style={styles.headerRight}>
          <Pressable style={styles.helpBtn} onPress={() => setShowHelp(true)}>
            <Ionicons
              name="help-circle-outline"
              size={20}
              color="rgba(255,255,255,0.85)"
            />
          </Pressable>

          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {clamp(deck.length - i, 0, 999)} left
            </Text>
          </View>
        </View>
      </View>

      {/* Deck */}
      <View style={styles.deckArea}>
        {/* Next card */}
        {!!next && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.card,
              styles.cardShadow,
              styles.nextCard,
              {
                transform: [
                  { scale: nextCardScale },
                  { translateY: nextCardTranslateY },
                ],
              },
            ]}
          >
            <Image source={{ uri: mainPhoto(next) }} style={styles.image} />
            <LinearGradient
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.20)", "rgba(0,0,0,0.55)"]}
              locations={[0, 0.55, 1]}
              style={styles.cardGradient}
            />

            <View style={styles.cardFooter}>
              <Text style={styles.name}>
                {next.name ?? "Someone"}{" "}
                <Text style={styles.age}>{next.age ?? "—"}</Text>
              </Text>
              <Text style={styles.bio} numberOfLines={2}>
                {next.bio ?? " "}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Top card (THIS was missing — it contains the image + pan responder) */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            styles.cardShadow,
            {
              opacity: cardOpacity,
              transform: [...position.getTranslateTransform(), { rotate }],
            },
          ]}
        >
          <Image source={{ uri: mainPhoto(current) }} style={styles.image} />

          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.20)", "rgba(0,0,0,0.55)"]}
            locations={[0, 0.55, 1]}
            style={styles.cardGradient}
          />

          {/* Badges */}
          <Animated.View
            style={[styles.badge, styles.likeBadge, { opacity: likeOpacity }]}
          >
            <Text style={styles.badgeText}>LIKE</Text>
          </Animated.View>

          <Animated.View
            style={[styles.badge, styles.passBadge, { opacity: passOpacity }]}
          >
            <Text style={styles.badgeText}>PASS</Text>
          </Animated.View>

          <Animated.View
            style={[styles.badge, styles.superBadge, { opacity: superOpacity }]}
          >
            <Text style={styles.badgeText}>SUPER LIKE</Text>
          </Animated.View>

          {/* Footer */}
          <View style={styles.cardFooter}>
            <Text style={styles.name}>
              {current.name ?? "Someone"}{" "}
              <Text style={styles.age}>{current.age ?? "—"}</Text>
            </Text>
            <Text style={styles.bio} numberOfLines={3}>
              {current.bio ?? " "}
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Actions */}
      <View style={styles.actionsWrap}>
        <Pressable
          style={({ pressed }) => [
            styles.iconBtn,
            styles.iconBtnNope,
            pressed && styles.pressed,
          ]}
          onPress={() => handleDecision("pass", -width - 260, 0)}
          disabled={sending}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.iconBtn,
            styles.iconBtnSuper,
            pressed && styles.pressed,
          ]}
          onPress={() => handleDecision("superlike", 0, -height - 260)}
          disabled={sending}
        >
          <Ionicons name="star" size={22} color="#fff" />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.iconBtn,
            styles.iconBtnLike,
            pressed && styles.pressed,
          ]}
          onPress={() => handleDecision("like", width + 260, 0)}
          disabled={sending}
        >
          <Ionicons name="heart" size={22} color="#fff" />
        </Pressable>
      </View>

      {!!err && <Text style={styles.errBottom}>{err}</Text>}

      {/* Help modal */}
      <Modal
        visible={showHelp}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHelp(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Swiping</Text>
            <Text style={styles.modalSub}>
              Swipe on the card, or use the buttons below.
            </Text>

            <View style={styles.tipRow}>
              <View style={styles.tipIcon}>
                <Ionicons
                  name="close"
                  size={18}
                  color="rgba(255,255,255,0.9)"
                />
              </View>
              <Text style={styles.tipText}>Pass</Text>
            </View>

            <View style={styles.tipRow}>
              <View style={styles.tipIcon}>
                <Ionicons name="star" size={16} color="rgba(255,255,255,0.9)" />
              </View>
              <Text style={styles.tipText}>Super like</Text>
            </View>

            <View style={styles.tipRow}>
              <View style={styles.tipIcon}>
                <Ionicons
                  name="heart"
                  size={16}
                  color="rgba(255,255,255,0.9)"
                />
              </View>
              <Text style={styles.tipText}>Like</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.modalBtn,
                pressed && { opacity: 0.9 },
              ]}
              onPress={() => setShowHelp(false)}
            >
              <Text style={styles.modalBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  brand: {
    fontSize: 26,
    color: "#EAD0F7",
    fontWeight: "900",
    letterSpacing: 0.2,
    fontFamily: "serif",
  },

  headerHint: {
    marginTop: 4,
    color: "rgba(255,255,255,0.60)",
    fontSize: 12.5,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  helpBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  pillText: {
    color: "rgba(255,255,255,0.86)",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 0.2,
  },

  deckArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
    minHeight: width * 1.22, // prevents “blank” feeling on some layouts
  },

  card: {
    width: "100%",
    borderRadius: 26,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  nextCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    opacity: 0.18,
  },

  cardShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.26,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 18 },
    elevation: 10,
    zIndex: 10,
  },

  image: {
    width: "100%",
    height: width * 1.22,
  },

  cardGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 240,
  },

  badge: {
    position: "absolute",
    top: 16,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: "rgba(0,0,0,0.22)",
  },

  likeBadge: { left: 14, borderColor: "rgba(34,197,94,0.55)" },
  passBadge: { right: 14, borderColor: "rgba(239,68,68,0.55)" },
  superBadge: { alignSelf: "center", borderColor: "rgba(234,208,247,0.55)" },

  badgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "rgba(255,255,255,0.92)",
    letterSpacing: 1.0,
  },

  cardFooter: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  },

  name: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  age: {
    color: "rgba(255,255,255,0.72)",
    fontWeight: "800",
  },

  bio: {
    marginTop: 6,
    fontSize: 13.5,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 19,
  },

  actionsWrap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    paddingTop: 10,
    paddingBottom: 12,
    width: "100%",
  },

  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  iconBtn: {
    width: 58,
    height: 58,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.12)",
  },

  iconBtnNope: { borderColor: "rgba(239,68,68,0.35)" },
  iconBtnSuper: { borderColor: "rgba(234,208,247,0.35)" },
  iconBtnLike: { borderColor: "rgba(34,197,94,0.35)" },

  title: {
    marginTop: 10,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  sub: {
    marginTop: 10,
    color: "rgba(255,255,255,0.68)",
    textAlign: "center",
    lineHeight: 20,
  },

  primaryBtn: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(234,208,247,0.14)",
  },

  primaryText: {
    color: "#EAD0F7",
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  muted: {
    marginTop: 10,
    color: "rgba(255,255,255,0.72)",
  },

  err: {
    marginTop: 14,
    color: "rgba(255,120,120,0.95)",
    textAlign: "center",
  },

  errBottom: {
    color: "rgba(255,120,120,0.9)",
    textAlign: "center",
    paddingBottom: 12,
    fontSize: 12.5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: 16,
  },

  modalCard: {
    backgroundColor: "rgba(10,14,30,0.98)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 16,
  },

  modalTitle: {
    color: "#EAD0F7",
    fontSize: 18,
    fontWeight: "900",
    fontFamily: "serif",
    marginBottom: 6,
  },

  modalSub: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },

  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },

  tipIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  tipText: {
    color: "rgba(255,255,255,0.86)",
    fontSize: 13.5,
    fontWeight: "800",
  },

  modalBtn: {
    marginTop: 14,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(234,208,247,0.35)",
    backgroundColor: "rgba(234,208,247,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },

  modalBtnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },
});
