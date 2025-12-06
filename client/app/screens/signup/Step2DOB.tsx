import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { patchMe } from "../../api";

export default function Step2DOB() {
  const router = useRouter();

  const [dob, setDob] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  // Age limits
  const today = new Date();
  const minDate = new Date(1950, 0, 1); // Jan 1, 1950
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  ); // must be 18+

  const handleOpenPicker = () => {
    setShowPicker(true);
  };

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (event.type === "set" && selectedDate) {
      setDob(selectedDate);
    }
  };

  const isAdult = (date: Date | null) => {
    if (!date) return false;
    return date <= maxDate;
  };

  const canContinue = dob !== null && isAdult(dob);

  const handleNext = async () => {
    if (!canContinue || !dob) return;

    try {
      await patchMe({
        dob: dob.toISOString(),
        onboardingStep: 2,
      });

      router.push("/screens/signup/Step3Gender");
    } catch (err: any) {
      console.log("DOB update error:", err.message);
      // you can add some UI error later if you want
    }
  };

  const formatDob = (date: Date | null) => {
    if (!date) return "Select your date of birth";
    return date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
          {/* Step badge */}
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Step 2 of 5</Text>
          </View>

          {/* Heading */}
          <Text style={styles.title}>When’s your birthday?</Text>
          <Text style={styles.subtitle}>
            We use this to confirm you’re 18+ and to help personalize your
            experience. Your age isn’t shown by default.
          </Text>

          {/* DOB Field */}
          <View style={styles.form}>
            <Text style={styles.label}>Date of Birth</Text>
            <Pressable onPress={handleOpenPicker}>
              <View
                style={[
                  styles.dobField,
                  !dob && { borderColor: "rgba(148,163,184,0.7)" },
                ]}
              >
                <Text
                  style={[
                    styles.dobText,
                    !dob && { color: "rgba(148,163,184,0.9)" },
                  ]}
                >
                  {formatDob(dob)}
                </Text>
              </View>
            </Pressable>

            {/* Helper */}
            <Text style={styles.helperText}>
              You must be at least{" "}
              <Text style={styles.helperHighlight}>18 years old</Text> to use
              Amoura.
            </Text>
          </View>

          {/* Continue button */}
          <Pressable
            disabled={!canContinue}
            onPress={handleNext}
            style={{ marginTop: 24 }}
          >
            <View style={[styles.btn, { opacity: canContinue ? 1 : 0.5 }]}>
              <Text style={styles.btnText}>Continue</Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Native Date Picker */}
      {showPicker && (
        <DateTimePicker
          value={dob || maxDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      )}
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.9)",
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
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "serif",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(229,231,235,0.9)",
    marginBottom: 26,
    lineHeight: 20,
  },
  form: {
    marginBottom: 10,
  },
  label: {
    color: "rgba(229,231,235,0.85)",
    fontSize: 13,
    marginBottom: 6,
  },
  dobField: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E1BEE7",
    backgroundColor: "rgba(15,23,42,0.95)",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  dobText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  helperText: {
    fontSize: 12,
    color: "rgba(148,163,184,0.95)",
    marginTop: 8,
  },
  helperHighlight: {
    color: "#E1BEE7",
    fontWeight: "600",
  },
  btn: {
    width: "100%",
    height: 52,
    backgroundColor: "#E1BEE7",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#0B132B",
    fontSize: 17,
    fontWeight: "700",
  },
});
