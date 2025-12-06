import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { patchMe } from "../../api";

const { width } = Dimensions.get("window");

export default function Step4Preference() {
  const [selected, setSelected] = useState<string | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const router = useRouter();

  const animate = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.07,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const options = [
    { label: "Men", value: "men", icon: "male-outline" },
    { label: "Women", value: "women", icon: "female-outline" },
    { label: "Everyone", value: "everyone", icon: "people-outline" },
  ];

  const handleNext = async () => {
    try {
      await patchMe({
        interestedIn: [selected],
        onboardingStep: 4,
      });

      router.push("/screens/signup/Step5Hobbies");
    } catch (err: any) {
      console.log("Preference update error:", err.message);
    }
  };
  return (
    <ImageBackground
      source={{
        uri: "https://cdn.pixabay.com/photo/2017/07/31/18/11/people-2559659_1280.jpg",
      }}
      style={styles.bg}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["#0B132B", "#2E1A3F", "#1A0E24"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.overlay}
      />

      <View style={styles.container}>
        <View style={styles.card}>
          {/* Step Badge */}
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Step 4 of 5</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Who are you interested in?</Text>
          <Text style={styles.subtitle}>
            Select what best fits your preference.
          </Text>

          {/* Options */}
          <View style={styles.optionWrapper}>
            {options.map((opt, index) => {
              const active = selected === opt.value;

              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    setSelected(opt.value);
                    animate();
                  }}
                >
                  <Animated.View
                    style={[
                      styles.option,
                      {
                        borderColor: active
                          ? "#E1BEE7"
                          : "rgba(255,255,255,0.25)",
                        backgroundColor: active
                          ? "rgba(225,190,231,0.18)"
                          : "rgba(255,255,255,0.06)",
                        transform: [{ scale: active ? scaleAnim : 1 }],
                      },
                    ]}
                  >
                    <Ionicons
                      name={opt.icon as any}
                      size={26}
                      color="#E1BEE7"
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.optionText}>{opt.label}</Text>
                  </Animated.View>
                </Pressable>
              );
            })}
          </View>

          {/* Continue Button */}
          <Pressable
            disabled={!selected}
            onPress={handleNext}
            style={{ marginTop: 30 }}
          >
            <View
              style={[
                styles.btn,
                { opacity: selected ? 1 : 0.4 },
              ]}
            >
              <Text style={styles.btnText}>Continue</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.93,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 26,
    paddingVertical: 32,
    paddingHorizontal: 22,
    borderWidth: 2,
    borderColor: "rgba(225,190,231,0.35)",
    shadowColor: "#E1BEE7",
    shadowOpacity: 0.25,
    shadowRadius: 18,
  },
  stepBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(225,190,231,0.45)",
    marginBottom: 16,
  },
  stepBadgeText: {
    color: "rgba(249,250,251,0.85)",
    fontSize: 11,
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 26,
    color: "#FFFFFF",
    fontWeight: "700",
    fontFamily: "serif",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(229,231,235,0.85)",
    marginBottom: 22,
    lineHeight: 20,
  },

  optionWrapper: {
    marginTop: 10,
  },

  option: {
    width: "100%",
    height: 58,
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  optionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  btn: {
    width: "100%",
    height: 55,
    backgroundColor: "#E1BEE7",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#0B132B",
    fontSize: 19,
    fontWeight: "700",
  },
});