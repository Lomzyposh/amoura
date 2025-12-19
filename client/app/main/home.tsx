import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  Animated,
  PanResponder,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Fake profiles
const PROFILES = [
  {
    id: 1,
    name: "Deborah",
    age: 20,
    bio: "Soft girl energy. 💗",
    distance: "5 km away",
    photo:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
  },

  {
    id: 1,
    name: "Deborah",
    age: 20,
    bio: "Soft girl energy. 💗",
    distance: "5 km away",
    photo:
      "https://plus.unsplash.com/premium_photo-1661724295894-9f4323058501?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmxhY2slMjBsYWR5fGVufDB8fDB8fHww",
  },

  {
    id: 2,
    name: "Amaka",
    age: 22,
    bio: "Fashion, art & soft life.",
    distance: "12 km away",
    photo:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  },
  {
    id: 3,
    name: "Sandra",
    age: 19,
    bio: "Calm & mysterious 😌",
    distance: "7 km away",
    photo:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  },
];

export default function HomeScreen() {
  const [index, setIndex] = useState(0);

  const position = useRef(new Animated.ValueXY()).current;

  // Go to next card
  const nextCard = () => {
    setIndex((prev) => (prev + 1) % PROFILES.length);
    position.setValue({ x: 0, y: 0 });
  };

  // Animate card off screen
  const forceSwipe = (dir: "left" | "right" | "up") => {
    let x = 0;
    let y = 0;

    if (dir === "left") x = -width - 200;
    if (dir === "right") x = width + 200;
    if (dir === "up") y = -height - 200;

    Animated.timing(position, {
      toValue: { x, y },
      duration: 250,
      useNativeDriver: true,
    }).start(nextCard);
  };

  // PAN RESPONDER (drag gesture)
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) =>
      Math.abs(g.dx) > 10 || Math.abs(g.dy) > 10,

    onPanResponderMove: Animated.event(
      [null, { dx: position.x, dy: position.y }],
      { useNativeDriver: false }
    ),

    onPanResponderRelease: (_, g) => {
      if (g.dx > 120) return forceSwipe("right"); // LIKE
      if (g.dx < -120) return forceSwipe("left"); // NOPE
      if (g.dy < -120) return forceSwipe("up"); // SUPER LIKE

      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
      }).start();
    },
  });

  const profile = PROFILES[index];

  // ROTATION + OPACITY
  const rotate = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ["-10deg", "0deg", "10deg"],
  });

  const opacity = position.x.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [0, 1, 0],
  });

  // =====================
// STACKED CARD POSITIONS
// =====================

// Scale + position for next cards
const nextCardScale = position.x.interpolate({
  inputRange: [-200, 0, 200],
  outputRange: [0.95, 1, 0.95],
  extrapolate: "clamp",
});

const nextCardTranslateY = position.x.interpolate({
  inputRange: [-200, 0, 200],
  outputRange: [20, 0, 20],
  extrapolate: "clamp",
});


  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>Amoura</Text>
      </View>

     {/* NEXT CARD (soft subtle stack preview) */}
{PROFILES[(index + 1) % PROFILES.length] && (
  <Animated.View
    style={[
      styles.card,
      {
        position: "absolute",
        top: 100,               // slight offset
        left: 0,
        right: 0,
        alignSelf: "center",

        // ✨ Perfect subtle stack effect
        transform: [{ scale: 0.94 }],
        opacity: 0.35,
      },
    ]}
    pointerEvents="none"
  >
    <Image
      source={{ uri: PROFILES[(index + 1) % PROFILES.length].photo }}
      style={styles.image}
    />

    <View style={styles.infoBox}>
      <Text style={styles.name}>
        {PROFILES[(index + 1) % PROFILES.length].name},{" "}
        {PROFILES[(index + 1) % PROFILES.length].age}
      </Text>

      <Text style={styles.bio}>
        {PROFILES[(index + 1) % PROFILES.length].bio}
      </Text>

      <Text style={styles.distance}>
        {PROFILES[(index + 1) % PROFILES.length].distance}
      </Text>
    </View>
  </Animated.View>
)}


{/* TOP SWIPE CARD */}
<Animated.View
  {...panResponder.panHandlers}
  style={[
    styles.card,
    {
      transform: [
        ...position.getTranslateTransform(),
        {
          rotate: position.x.interpolate({
            inputRange: [-200, 0, 200],
            outputRange: ["-10deg", "0deg", "10deg"],
          }),
        },
      ],
    },
  ]}
>
  <Image source={{ uri: profile.photo }} style={styles.image} />

  <View style={styles.infoBox}>
    <Text style={styles.name}>{profile.name}, {profile.age}</Text>
    <Text style={styles.bio}>{profile.bio}</Text>
    <Text style={styles.distance}>{profile.distance}</Text>
  </View>


      </Animated.View>

      {/* ACTION BUTTONS */}
      <View style={styles.actions}>
        <Pressable
          style={[styles.actionBtn, styles.nopeBtn]}
          onPress={() => forceSwipe("left")}
        >
          <Text style={styles.actionText}>✖</Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, styles.superBtn]}
          onPress={() => forceSwipe("up")}
        >
          <Text style={styles.actionText}>⭐</Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, styles.likeBtn]}
          onPress={() => forceSwipe("right")}
        >
          <Text style={styles.actionText}>❤</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B132B",
    paddingHorizontal: 20,
    paddingTop: 30,        // reduced
    alignItems: "center",
  },

  /* HEADER */
  header: {
    width: "100%",
    marginBottom: 10,       // reduced
  },

  logo: {
    fontSize: 28,
    color: "#EAD0F7",
    fontWeight: "700",
    fontFamily: "serif",
  },

  /* PROFILE CARD */
card: {
  width: "100%",
  backgroundColor:  "#c9acbaff" , // frosted navy tint
  borderRadius: 25,
  overflow: "hidden",
  marginBottom: 18,
  borderWidth: 1.5,
  borderColor: "rgba(255,255,255,0.15)",
},



  image: {
    width: "100%",
    height: width * 1.2,     // REDUCED IMAGE HEIGHT
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  infoBox: {
    padding: 18,
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0B132B",
  },

  bio: {
    fontSize: 15,
    color: "rgba(0,0,0,0.65)",
    marginTop: 3,
  },

  distance: {
    marginTop: 6,
    fontSize: 14,
    color: "#666",
  },

  /* ACTION BUTTONS */
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 10,
  },

  actionBtn: {
    width: 55,             // smaller buttons
    height: 55,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  nopeBtn: {
    backgroundColor: "rgba(255,80,80,0.25)",
  },

  superBtn: {
    backgroundColor: "rgba(255,215,0,0.25)",
  },

  likeBtn: {
    backgroundColor: "rgba(255,105,180,0.25)",
  },

  actionText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "700",
  },
});