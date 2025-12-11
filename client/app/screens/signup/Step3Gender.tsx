import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { patchMe } from "../../api";

export default function Step3Gender() {
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

  const genders = [
    {
      label: "Male",
      value: "male",
      description: "Show me to people looking for men.",
    },
    {
      label: "Female",
      value: "female",
      description: "Show me to people looking for women.",
    },
    {
      label: "Non-binary",
      value: "nonbinary",
      description: "I don’t identify strictly as male or female.",
    },
    {
      label: "Prefer not to say",
      value: "none",
      description: "You can update this later in your settings.",
    },
  ];

  const canContinue = !!selected;

  const handleContinue = async () => {
    try {
      await patchMe({
        gender: selected,
        onboardingStep: 3,
      });

      router.push("/screens/signup/Step4Preferences");
    } catch (err: any) {
      console.log("Gender update error:", err.message);
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
      {/* Same gradient overlay as other steps */}
      <LinearGradient
        colors={["#0B132B", "#2E1A3F", "#1A0E24"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.overlay}
      />

      <View style={styles.container}>
        <View style={styles.card}>
          {/* Step indicator */}
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Step 3 of 5</Text>
          </View>

          {/* Heading */}
          <Text style={styles.title}>How do you identify?</Text>
          <Text style={styles.subtitle}>
            We ask for your gender so we can tailor matches and experiences for
            you. You can always edit this later in your profile.
          </Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {genders.map((g, index) => {
              const isActive = selected === g.value;

              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    setSelected(g.value);
                    animate();
                  }}
                  style={{ width: "100%" }}
                >
                  <Animated.View
                    style={[
                      styles.optionCard,
                      {
                        borderColor: isActive
                          ? "#E1BEE7"
                          : "rgba(255,255,255,0.25)",
                        backgroundColor: isActive
                          ? "rgba(225,190,231,0.18)"
                          : "rgba(255,255,255,0.05)",
                        transform: [{ scale: isActive ? scaleAnim : 1 }],
                      },
                    ]}
                  >
                    <Text style={styles.optionLabel}>{g.label}</Text>
                    <Text style={styles.optionDescription}>
                      {g.description}
                    </Text>
                  </Animated.View>
                </Pressable>
              );
            })}
          </View>

          {/* Continue button */}
          <Pressable
            disabled={!canContinue}
            onPress={handleContinue}
            style={{ marginTop: 28 }}
          >
            <View style={[styles.btn, { opacity: canContinue ? 1 : 0.5 }]}>
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
    opacity: 0.92,
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
    shadowRadius: 15,
  },

  stepBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.8)",
    borderWidth: 1,
    borderColor: "rgba(225,190,231,0.5)",
    marginBottom: 16,
  },

  stepBadgeText: {
    color: "rgba(249,250,251,0.85)",
    fontSize: 11,
    letterSpacing: 0.6,
  },

  title: {
    fontSize: 26,
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 6,
    fontFamily: "serif",
  },

  subtitle: {
    fontSize: 14,
    color: "rgba(229,231,235,0.9)",
    marginBottom: 24,
    lineHeight: 20,
  },

  optionsContainer: {
    width: "100%",
    marginTop: 8,
  },

  optionCard: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
  },

  optionLabel: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },

  optionDescription: {
    color: "rgba(229,231,235,0.85)",
    fontSize: 13,
    lineHeight: 18,
  },

  btn: {
    height: 55,
    backgroundColor: "#E1BEE7",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "#0B132B",
    fontSize: 18,
    fontWeight: "700",
  },
});
