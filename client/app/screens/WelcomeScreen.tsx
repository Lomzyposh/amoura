import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ImageBackground,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const AVATARS = [
  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg",
  "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg",
  "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
  "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
];

const WelcomeScreen: React.FC = () => {
  const ctaScale = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  const animateCta = (toValue: number) => {
    Animated.spring(ctaScale, {
      toValue,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = () => {
    router.push("/screens/signup/Step1Basic");
  };

  const handleLogin = () => {
    router.push("/screens/login");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://cdn.pixabay.com/photo/2017/07/31/18/11/people-2559659_1280.jpg",
      }}
      style={styles.root}
      resizeMode="cover"
    >
      {/* Dark gradient overlay same vibe as login */}
      <LinearGradient
        colors={["#0B132B", "#2E1A3F", "#1A0E24"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Phone-like card */}
      <View style={styles.card}>
        {/* Top collage */}
        <View style={styles.photoGrid}>
          {AVATARS.map((uri, i) => (
            <View key={i} style={styles.photoWrapper}>
              <ImageBackground
                source={{ uri }}
                style={styles.photo}
                imageStyle={styles.photoImage}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.35)"]}
                  style={StyleSheet.absoluteFill}
                />
              </ImageBackground>
            </View>
          ))}
        </View>

        {/* Heart icon */}
        <View style={styles.heartWrap}>
          <Ionicons name="heart-outline" size={28} color="#E1BEE7" />
        </View>

        {/* Text */}
        <View style={styles.textBlock}>
          <Text style={styles.heading}>Inclusive, reliable, safe.</Text>
          <Text style={styles.subtitle}>
            Go beyond your social circle and connect with people near and far.
          </Text>
        </View>

        {/* CTA */}
        <Pressable
          onPress={handleNext}
          onPressIn={() => animateCta(1.05)}
          onPressOut={() => animateCta(1)}
          style={{ width: "100%" }}
        >
          <Animated.View
            style={[
              styles.ctaButton,
              { transform: [{ scale: ctaScale }] },
            ]}
          >
            <Text style={styles.ctaText}>Next</Text>
          </Animated.View>
        </Pressable>

        {/* Login link */}
        <Pressable onPress={handleLogin}>
          <Text style={styles.loginHint}>
            Already have an account?{" "}
            <Text style={styles.loginLink}>Login</Text>
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: 380,
    aspectRatio: 9 / 16,
    // backgroundColor: "rgba(15,23,42,0.92)", // dark glass
    borderRadius: 34,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 26,
    // borderWidth: 1.5,
    // borderColor: "rgba(193,163,239,0.7)", // lilac border like login inputs
    // shadowColor: "#000",
    // shadowOpacity: 0.55,
    // shadowRadius: 24,
    // shadowOffset: { width: 0, height: 16 },
    // elevation: 18,
    justifyContent: "space-between",
  },

  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginBottom: 18,
  },

  photoWrapper: {
    width: "30%",
    aspectRatio: 3 / 4,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#020617",
  },

  photo: {
    flex: 1,
  },

  photoImage: {
    borderRadius: 18,
  },

  heartWrap: {
    alignSelf: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: "rgba(225,190,231,0.8)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,23,42,0.95)",
    marginBottom: 10,
  },

  textBlock: {
    alignItems: "center",
    marginBottom: 18,
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F9FAFB",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 13,
    color: "rgba(209,213,219,0.9)",
    textAlign: "center",
    lineHeight: 18,
  },

  ctaButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E1BEE7", // same accent as login button
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  ctaText: {
    color: "#0B132B",
    fontSize: 17,
    fontWeight: "700",
  },

  loginHint: {
    fontSize: 12,
    color: "rgba(229,231,235,0.8)",
    textAlign: "center",
  },

  loginLink: {
    color: "#E1BEE7",
    fontWeight: "600",
  },
});