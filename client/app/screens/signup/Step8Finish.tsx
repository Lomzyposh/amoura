import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Step8Finish() {
  const router = useRouter();

  // Start at 0, animate to 1
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Run both animations together on NATIVE driver only
    const anim = Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);

    anim.start();

    // Cleanup on unmount
    return () => {
      anim.stop();
    };
  }, [scaleAnim, opacityAnim]);

  const handleStart = async () => {
    try {
      // if you want to mark onboarding complete on backend:
      // await patchMe({ onboardingStep: 8 });
      router.replace("/main/home");

    } catch (err) {
      console.log("Finish navigation error:", err);
    }
  };

  return (
    <LinearGradient
      colors={["#0B132B", "#2E1A3F", "#1A0E24"]}
      style={styles.bg}
    >
      <View style={styles.container}>
        {/* Animated Checkmark Circle */}
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Text style={styles.check}>✓</Text>
        </Animated.View>

        <Animated.Text style={[styles.title, { opacity: opacityAnim }]}>
          Your Profile is Ready!
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, { opacity: opacityAnim }]}>
          Let’s help you meet someone special.
        </Animated.Text>

        <Pressable onPress={handleStart} style={styles.startBtn}>
          <Text style={styles.startText}>Start Connecting</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 25,
  },
  circle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 3,
    borderColor: "#E1BEE7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  check: {
    fontSize: 50,
    color: "#E1BEE7",
    fontWeight: "700",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "serif",
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginBottom: 40,
    fontFamily: "serif",
  },
  startBtn: {
    width: width * 0.85,
    height: 55,
    backgroundColor: "#E1BEE7",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  startText: {
    color: "#0B132B",
    fontSize: 20,
    fontWeight: "600",
  },
});