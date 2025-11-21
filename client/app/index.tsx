import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Easing,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import WelcomeScreen from "./screens/WelcomeScreen";

const { width } = Dimensions.get("window");
const LETTERS = ["A", "m", "o", "u", "r", "a"];

// toggle this during dev if you ever want to quickly kill splash
const DISABLE_SPLASH = false;

function SplashScreen({ onFinish }: { onFinish?: () => void }) {
  const fadeTag = useRef(new Animated.Value(0)).current;
  const lightSlide = useRef(new Animated.Value(-width)).current;
  const letters = LETTERS.map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    if (DISABLE_SPLASH) {
      onFinish && onFinish();
      return;
    }

    const letterAnims = letters.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: i * 120,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    );

    Animated.sequence([
      Animated.stagger(120, letterAnims),
      Animated.delay(300),
      Animated.timing(lightSlide, {
        toValue: width,
        duration: 1500,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(fadeTag, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.delay(600),
    ]).start(() => {
      onFinish && onFinish();
    });
  }, [fadeTag, lightSlide, letters, onFinish]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0B132B", "#2E1A3F", "#1A0E24"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.wordBox}>
          {LETTERS.map((char, i) => {
            const opacity = letters[i];
            const translateY = opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            });

            return (
              <Animated.Text
                key={i}
                style={[
                  styles.letter,
                  {
                    opacity,
                    transform: [{ translateY }],
                    textShadowColor: "rgba(255,255,255,0.4)",
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  },
                ]}
              >
                {char}
              </Animated.Text>
            );
          })}

          <Animated.View
            style={[
              styles.lightBeam,
              { transform: [{ translateX: lightSlide }] },
            ]}
          />
        </View>

        <Animated.Text style={[styles.tagline, { opacity: fadeTag }]}>
          Real connections, real love
        </Animated.Text>
      </LinearGradient>
    </View>
  );
}

export default function Index() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false); // did we check session?
  const [splashDone, setSplashDone] = useState(false);
  const welcomeOpacity = useRef(new Animated.Value(0)).current;

  // 🔐 1) Check if user has a saved token/session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await AsyncStorage.getItem("amoura_token");

        if (token) {
          router.replace("/main/home");
          return;
        }
      } catch (err) {
        console.log("Session check failed:", err);
      } finally {
        setAuthChecked(true);
      }
    };

    checkSession();
  }, [router]);

  // 2) When splash finishes, fade in Welcome screen
  const handleFinish = () => {
    setSplashDone(true);

    Animated.timing(welcomeOpacity, {
      toValue: 1,
      duration: 700,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // While we are still checking for existing session → small loader
  if (!authChecked) {
    return (
      <LinearGradient
        colors={["#0B132B", "#2E1A3F", "#1A0E24"]}
        style={styles.gradient}
      >
        <ActivityIndicator size="large" color="#E1BEE7" />
      </LinearGradient>
    );
  }

  // If no session → show Splash + Welcome as usual
  return (
    <View style={{ flex: 1 }}>
      {/* Splash behind */}
      {!DISABLE_SPLASH && !splashDone && (
        <View style={StyleSheet.absoluteFill}>
          <SplashScreen onFinish={handleFinish} />
        </View>
      )}

      {/* Welcome screen fades in */}
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          opacity: DISABLE_SPLASH ? 1 : welcomeOpacity,
        }}
      >
        <WelcomeScreen />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wordBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  letter: {
    color: "#FFFFFF",
    fontSize: Math.min(width * 0.12, 60),
    fontWeight: "700",
    fontFamily: "serif",
    letterSpacing: 1.5,
  },
  lightBeam: {
    position: "absolute",
    top: "40%",
    left: 0,
    width: width * 0.32,
    height: width * 0.055,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 40,
    shadowColor: "#ffffff",
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 5,
  },
  tagline: {
    marginTop: 12,
    fontSize: Math.min(width * 0.04, 18),
    color: "rgba(255,255,255,0.9)",
    fontFamily: "serif",
  },
});