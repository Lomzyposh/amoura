import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Dimensions,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { patchMe } from "../../api";

const { width } = Dimensions.get("window");
const CARD_MAX = 430;

export default function Step7Bio() {
  const router = useRouter();
  const [bio, setBio] = useState("");

  const canContinue = bio.trim().length >= 20; // encourage quality bios

  const handleContinue = async () => {
    try {
      await patchMe({
        bio,
        onboardingStep: 7,
      });

      router.push("/screens/signup/Step8Finish");
    } catch (err: any) {
      console.log("Bio update error:", err.message);
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
        style={styles.overlay}
      />

      <View style={styles.outer}>
        <View style={styles.card}>
          {/* Step Badge */}
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Step 7 of 8</Text>
          </View>

          {/* Bubble Header */}
          <View style={styles.bubbleHeader}>
            <Text style={styles.bubbleEmoji}>📝</Text>
            <Text style={styles.bubbleTitle}>About You</Text>
          </View>

          <Text style={styles.subtitle}>
            Share something short and sweet. This helps people know your vibe.
          </Text>

          {/* Bio Input */}
          <View style={styles.bioContainer}>
            <TextInput
              style={styles.bioBox}
              placeholder="Write something that reflects your personality..."
              placeholderTextColor="rgba(255,255,255,0.45)"
              multiline
              maxLength={200}
              value={bio}
              onChangeText={setBio}
              textAlignVertical="top"
            />

            <Text style={styles.charCount}>{bio.length}/200</Text>
          </View>

          {/* Continue Button */}
          <Pressable
            disabled={!canContinue}
            onPress={() => handleContinue()}
            style={{ marginTop: 25 }}
          >
            <View style={[styles.btn, { opacity: canContinue ? 1 : 0.4 }]}>
              <Text style={styles.btnText}>Continue</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const cardWidth = Math.min(width * 0.9, CARD_MAX);

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.92,
  },

  outer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
  },

  card: {
    width: cardWidth,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.09)",
    borderRadius: 26,
    paddingVertical: 32,
    paddingHorizontal: 22,
    borderWidth: 2,
    borderColor: "rgba(225,190,231,0.35)",
    shadowColor: "#E1BEE7",
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },

  stepBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(225,190,231,0.45)",
    marginBottom: 18,
  },
  stepBadgeText: {
    color: "rgba(249,250,251,0.85)",
    fontSize: 11,
    letterSpacing: 0.4,
  },

  bubbleHeader: {
    alignSelf: "center",
    backgroundColor: "rgba(225, 190, 231, 0.18)",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(225,190,231,0.4)",
  },
  bubbleEmoji: {
    fontSize: 22,
    marginRight: 6,
  },
  bubbleTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "serif",
  },

  subtitle: {
    fontSize: 15,
    color: "rgba(229,231,235,0.85)",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },

  bioContainer: {
    width: "100%",
    position: "relative",
  },
  bioBox: {
    width: "100%",
    height: 160,
    backgroundColor: "rgba(15,23,42,0.94)",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(225,190,231,0.45)",
    padding: 16,
    color: "#fff",
    fontSize: 15,
  },
  charCount: {
    position: "absolute",
    bottom: 8,
    right: 12,
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
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
