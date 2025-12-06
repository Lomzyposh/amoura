import React, { useCallback, useEffect, useRef, useState } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5000/api";

type Photo = {
  url: string;
  order?: number;
};

type Profile = {
  _id: string;
  name: string;
  dob?: string;
  gender?: string;
  bio?: string;
  photos?: Photo[];
};

const SWIPE_THRESHOLD = width * 0.25;

function getAgeFromDob(dob?: string) {
  if (!dob) return undefined;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return undefined;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export default function HomeScreen() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const swipe = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gesture) => {
        return Math.abs(gesture.dx) > 10 || Math.abs(gesture.dy) > 10;
      },
      onPanResponderMove: Animated.event(
        [null, { dx: swipe.x, dy: swipe.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_evt, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe("right");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe("left");
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const resetPosition = () => {
    Animated.spring(swipe, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 5,
    }).start();
  };

  const forceSwipe = (direction: "left" | "right") => {
    if (swiping) return;
    setSwiping(true);

    const x = direction === "right" ? width * 1.5 : -width * 1.5;

    Animated.timing(swipe, {
      toValue: { x, y: 0 },
      duration: 260,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = async (direction: "left" | "right") => {
    const profile = profiles[currentIndex];
    const nextIndex = currentIndex + 1;

    swipe.setValue({ x: 0, y: 0 });
    setSwiping(false);

    if (profile) {
      // Fire & forget swipe to backend
      try {
        const token = await AsyncStorage.getItem("amoura_token");
        await fetch(`${API_BASE_URL}/swipes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            toUser: profile._id,
            direction: direction === "right" ? "like" : "pass",
          }),
        });
      } catch (err) {
        console.log("Swipe send error:", err);
        // we won't block UI on error
      }
    }

    if (nextIndex >= profiles.length) {
      // Try to fetch new feed
      fetchFeed();
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setCurrentIndex(0);

      const token = await AsyncStorage.getItem("amoura_token");
      const res = await fetch(`${API_BASE_URL}/users/discover`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.log("Discover error text:", text);
        throw new Error("Failed to load profiles");
      }

      const data: Profile[] = await res.json();
      setProfiles(data || []);
    } catch (err: any) {
      console.log("Discover error:", err);
      setError(err.message || "Could not load profiles");
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const currentProfile = profiles[currentIndex];

  const rotate = swipe.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ["-15deg", "0deg", "15deg"],
    extrapolate: "clamp",
  });

  const likeOpacity = swipe.x.interpolate({
    inputRange: [0, width * 0.4],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const nopeOpacity = swipe.x.interpolate({
    inputRange: [-width * 0.4, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const cardStyle = {
    transform: [...swipe.getTranslateTransform(), { rotate }],
  };

  const renderActions = () => {
    if (!currentProfile) return null;

    return (
      <View style={styles.actionsRow}>
        <Pressable
          style={[styles.circleBtn, styles.passBtn]}
          onPress={() => forceSwipe("left")}
        >
          <Text style={styles.actionText}>✕</Text>
        </Pressable>

        <Pressable
          style={[styles.circleBtn, styles.likeBtn]}
          onPress={() => forceSwipe("right")}
        >
          <Text style={styles.actionText}>♥</Text>
        </Pressable>
      </View>
    );
  };

  const renderBody = () => {
    if (loading && profiles.length === 0) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.subtleText}>Finding people for you…</Text>
        </View>
      );
    }

    if (!!error && profiles.length === 0) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.reloadBtn} onPress={fetchFeed}>
            <Text style={styles.reloadText}>Try again</Text>
          </Pressable>
        </View>
      );
    }

    if (!currentProfile) {
      return (
        <View style={styles.center}>
          <Text style={styles.bioText}>You&apos;re all caught up ✨</Text>
          <Text style={styles.subtleText}>
            Check back later or adjust your preferences.
          </Text>
          <Pressable style={styles.reloadBtn} onPress={fetchFeed}>
            <Text style={styles.reloadText}>Refresh feed</Text>
          </Pressable>
        </View>
      );
    }

    const age = getAgeFromDob(currentProfile.dob);
    const mainPhoto =
      currentProfile.photos && currentProfile.photos.length > 0
        ? currentProfile.photos[0].url
        : undefined;

    return (
      <>
        <View style={styles.cardWrapper}>
          <Animated.View
            style={[styles.card, cardStyle]}
            {...panResponder.panHandlers}
          >
            {mainPhoto ? (
              <Image
                source={{ uri: mainPhoto }}
                style={styles.photo}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.noPhoto}>
                <Text style={styles.noPhotoEmoji}>🖤</Text>
              </View>
            )}

            {/* LIKE / NOPE labels */}
            <Animated.View
              style={[styles.badge, styles.likeBadge, { opacity: likeOpacity }]}
            >
              <Text style={styles.badgeText}>LIKE</Text>
            </Animated.View>
            <Animated.View
              style={[styles.badge, styles.nopeBadge, { opacity: nopeOpacity }]}
            >
              <Text style={styles.badgeText}>NOPE</Text>
            </Animated.View>

            {/* Info area */}
            <View style={styles.infoOverlay}>
              <Text style={styles.nameText}>
                {currentProfile.name}
                {age ? <Text style={styles.ageText}>  {age}</Text> : null}
              </Text>
              {currentProfile.bio ? (
                <Text style={styles.bioText} numberOfLines={2}>
                  {currentProfile.bio}
                </Text>
              ) : null}
            </View>
          </Animated.View>
        </View>

        {renderActions()}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Amoura</Text>
        <Text style={styles.headerSubtitle}>Swipe with intention</Text>
      </View>

      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingTop: 60,
    paddingHorizontal: 18,
  },
  header: {
    marginBottom: 18,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F9FAFB",
  },
  headerSubtitle: {
    marginTop: 4,
    color: "rgba(148,163,184,0.95)",
    fontSize: 14,
  },
  cardWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: width * 0.9,
    height: height * 0.6,
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: "#0F172A",
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  noPhoto: {
    flex: 1,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
  },
  noPhotoEmoji: {
    fontSize: 42,
  },
  infoOverlay: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: "rgba(15,23,42,0.6)",
  },
  nameText: {
    color: "#F9FAFB",
    fontSize: 22,
    fontWeight: "700",
  },
  ageText: {
    color: "#E5E7EB",
    fontSize: 20,
    fontWeight: "500",
  },
  bioText: {
    marginTop: 4,
    color: "rgba(209,213,219,0.9)",
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 40,
  },
  circleBtn: {
    width: 74,
    height: 74,
    borderRadius: 37,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderWidth: 2,
  },
  passBtn: {
    borderColor: "rgba(248,113,113,0.9)",
  },
  likeBtn: {
    borderColor: "rgba(244,114,182,0.9)",
  },
  actionText: {
    fontSize: 30,
    color: "#F9FAFB",
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  subtleText: {
    marginTop: 8,
    color: "rgba(148,163,184,0.95)",
    fontSize: 14,
    textAlign: "center",
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 12,
  },
  reloadBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.8)",
    marginTop: 6,
  },
  reloadText: {
    color: "#E5E7EB",
    fontWeight: "600",
  },
  badge: {
    position: "absolute",
    top: 30,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 2,
  },
  likeBadge: {
    right: 20,
    borderColor: "rgba(52,211,153,0.95)",
  },
  nopeBadge: {
    left: 20,
    borderColor: "rgba(248,113,113,0.95)",
  },
  badgeText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#F9FAFB",
  },
});