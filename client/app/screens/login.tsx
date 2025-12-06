import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TextInput,
  ImageBackground,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postJSON } from "../api";


const { width } = Dimensions.get("window");

const LoginScreen: React.FC = () => {
  const router = useRouter();

  // Animations
  const loginScale = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Form state
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);

  const animateScale = (toValue: number) => {
    Animated.spring(loginScale, {
      toValue,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const shakeCard = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 70,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    if (!email.trim() || !pass.trim()) {
      setError("Please fill in both email and password.");
      shakeCard();
      return;
    }

    try {
      setError(null);

      const res = await postJSON("/auth/login", {
        email: email.trim(),
        password: pass,
      });

      // res = { user, token }
      await AsyncStorage.setItem("amoura_token", res.token);
      await AsyncStorage.setItem("amoura_user", JSON.stringify(res.user));

      // later: navigate to main app / home screen
      router.push("/"); // or router.push("/home") once you build it
    } catch (err: any) {
      console.log("Login error:", err.message);
      setError(err.message || "Unable to login, try again.");
      shakeCard();
    }
  };

  const handleGoToSignup = () => {
    router.push("/screens/signup/Step1Basic");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://cdn.pixabay.com/photo/2017/07/31/18/11/people-2559659_1280.jpg",
      }}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ translateX: shakeAnim }],
              },
            ]}
          >
            {/* App badge / logo area */}
            <View style={styles.badge}>
              <Ionicons name="sparkles-outline" size={18} color="#E5E7EB" />
              <Text style={styles.badgeText}>Welcome to Amoura</Text>
            </View>

            {/* Heading */}
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to reconnect, continue conversations, and pick up right
              where you left off.
            </Text>

            {/* Error message */}
            {error && (
              <View style={styles.errorBox}>
                <Ionicons
                  name="warning-outline"
                  size={18}
                  color="#FCA5A5"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* EMAIL */}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#C4B5FD"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="example@email.com"
                  placeholderTextColor="rgba(229,231,235,0.6)"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* PASSWORD */}
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#C4B5FD"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="rgba(229,231,235,0.6)"
                  secureTextEntry={!passwordVisible}
                  style={styles.input}
                  value={pass}
                  onChangeText={setPass}
                />
                <Pressable
                  onPress={() => setPasswordVisible((prev) => !prev)}
                  hitSlop={10}
                >
                  <Ionicons
                    name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#E5E7EB"
                  />
                </Pressable>
              </View>
            </View>

            {/* FORGOT PASSWORD */}
            <Pressable style={styles.forgotWrapper} onPress={() => router.push("/screens/ForgotPassword")}>
              <Text style={styles.forgot}>Forgot password?</Text>
            </Pressable>

            {/* LOGIN BUTTON */}
            <Animated.View
              style={[
                styles.btn,
                {
                  transform: [{ scale: loginScale }],
                },
              ]}
            >
              <Pressable
                style={styles.btnPressable}
                onPressIn={() => animateScale(1.03)}
                onPressOut={() => animateScale(1)}
                onPress={handleLogin}
              >
                <Text style={styles.btnText}>Log in</Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#0B132B"
                  style={{ marginLeft: 6 }}
                />
              </Pressable>
            </Animated.View>

            <View style={styles.footerRow}>
              <Text style={styles.accountText}>Don’t have an account?</Text>
              <Pressable onPress={handleGoToSignup} hitSlop={10}>
                <Text style={styles.signUp}>Sign up</Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  bg: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,12,24,0.88)",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  card: {
    width: "90%",
    maxWidth: 420,
    backgroundColor: "rgba(17,24,39,0.9)",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "rgba(129,140,248,0.4)",
    paddingHorizontal: 22,
    paddingVertical: 28,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(55,65,81,0.8)",
    marginBottom: 16,
  },
  badgeText: {
    color: "#E5E7EB",
    fontSize: 12,
    marginLeft: 4,
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F9FAFB",
    textAlign: "left",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(209,213,219,0.9)",
    marginBottom: 20,
    lineHeight: 20,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(248,113,113,0.12)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.5)",
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 13,
    flex: 1,
  },
  field: {
    width: "100%",
    marginBottom: 14,
  },
  label: {
    color: "#E5E7EB",
    fontSize: 13,
    marginBottom: 6,
    opacity: 0.9,
  },
  inputWrapper: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(129,140,248,0.7)",
    backgroundColor: "rgba(15,23,42,0.9)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#F9FAFB",
  },
  forgotWrapper: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 4,
    marginBottom: 20,
  },
  forgot: {
    color: "#C4B5FD",
    fontSize: 13,
  },
  btn: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#C4B5FD",
    marginBottom: 18,
  },
  btnPressable: {
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  btnText: {
    color: "#0B132B",
    fontSize: 17,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  accountText: {
    color: "#E5E7EB",
    fontSize: 14,
    marginRight: 4,
    opacity: 0.85,
  },
  signUp: {
    color: "#C4B5FD",
    fontSize: 14,
    fontWeight: "600",
  },
});
