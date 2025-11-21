import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Animated,
  ImageBackground,
} from "react-native";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { postJSON } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Step1Basic() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [checked, setChecked] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = async () => {
    if (
      !fullName ||
      !email ||
      !pass ||
      !confirm ||
      !checked ||
      pass !== confirm
    ) {
      shake();
      return;
    }

    try {
      // Call backend register
      const res = await postJSON("/auth/register", {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: pass,
        // For now we only send basic fields.
        // Later you can extend this to also send dob, gender, etc.
      });

      // Store token + user
      await AsyncStorage.setItem("amoura_token", res.token);
      await AsyncStorage.setItem("amoura_user", JSON.stringify(res.user));

      // Move to next onboarding step
      router.push("/screens/signup/Step2DOB");
    } catch (err: any) {
      console.log("Register error:", err);
      // You can add an error state like in login if you want:
      // setError(err.message || "Unable to register");
      shake();
    }
  };

  const canContinue =
    fullName && email && pass && confirm && checked && pass === confirm;

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
        <Animated.View
          style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}
        >
          {/* Step indicator */}
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Step 1 of 5</Text>
          </View>

          {/* Page heading */}
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Let’s set up your profile. This helps us personalize your Amoura
            experience.
          </Text>

          {/* FORM FIELDS */}
          <View style={{ marginTop: 20 }}>
            {/* Full Name */}
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputField}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#E1BEE7"
                style={styles.icon}
              />
              <TextInput
                placeholder="Enter your full name"
                placeholderTextColor="rgba(255,255,255,0.5)"
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Email */}
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputField}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#E1BEE7"
                style={styles.icon}
              />
              <TextInput
                placeholder="example@mail.com"
                placeholderTextColor="rgba(255,255,255,0.5)"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputField}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#E1BEE7"
                style={styles.icon}
              />
              <TextInput
                placeholder="Create password"
                placeholderTextColor="rgba(255,255,255,0.5)"
                secureTextEntry
                style={styles.input}
                value={pass}
                onChangeText={setPass}
              />
            </View>

            {/* Confirm Password */}
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputField}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#E1BEE7"
                style={styles.icon}
              />
              <TextInput
                placeholder="Re-enter password"
                placeholderTextColor="rgba(255,255,255,0.5)"
                secureTextEntry
                style={styles.input}
                value={confirm}
                onChangeText={setConfirm}
              />
            </View>
          </View>

          {/* TERMS CHECKBOX */}
          <View style={styles.checkboxRow}>
            <Checkbox
              value={checked}
              onValueChange={setChecked}
              color={checked ? "#E1BEE7" : undefined}
            />
            <Text style={styles.checkText}>
              I agree to the <Text style={styles.link}>Terms & Conditions</Text>
            </Text>
          </View>

          {/* Continue Button */}
          <Pressable onPress={handleNext} disabled={!canContinue}>
            <View style={[styles.btn, { opacity: canContinue ? 1 : 0.5 }]}>
              <Text style={styles.btnText}>Continue</Text>
            </View>
          </Pressable>
          <Text style={{ marginTop: 15, color: "rgba(255,255,255,0.8)", fontSize: 14, textAlign: "center" }}>
            Already have an account?{" "}
            <Text
              style={styles.link}
              onPress={() => router.push("/screens/login")}
              >
              Log In
              </Text>
          </Text>
        </Animated.View>
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
    height: "100%",
    justifyContent: "center",
    // paddingHorizontal: 20,
    // justifyContent: "center",
    // paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    backgroundColor: "transparent",
    paddingVertical: 35,
    paddingHorizontal: 22,
    borderRadius: 26,
    // borderColor: "rgba(225,190,231,0.35)",
    // borderWidth: 2,
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
    marginBottom: 14,
  },
  stepBadgeText: {
    color: "rgba(249,250,251,0.85)",
    fontSize: 11,
    letterSpacing: 0.6,
  },

  title: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 8,
    fontFamily: "serif",
  },

  subtitle: {
    fontSize: 14,
    color: "rgba(229,231,235,0.9)",
    marginBottom: 25,
    lineHeight: 20,
  },

  label: {
    color: "rgba(229,231,235,0.85)",
    fontSize: 13,
    marginBottom: 6,
    marginTop: 12,
  },

  inputField: {
    height: 50,
    borderRadius: 12,
    borderWidth: 0.7,
    borderColor: "#E1BEE7",
    backgroundColor: "rgba(15,23,42,0.95)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  icon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },

  checkText: {
    marginLeft: 10,
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
  },

  link: {
    color: "#E1BEE7",
    fontWeight: "600",
  },

  btn: {
    height: 55,
    backgroundColor: "#E1BEE7",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "#0B132B",
    fontSize: 18,
    fontWeight: "700",
  },
});
