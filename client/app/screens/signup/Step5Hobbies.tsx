import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { patchMe } from "@/app/api";

const { width } = Dimensions.get("window");

export default function Step5Hobbies() {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  const hobbies = [
    "Reading", "Music", "Gym", "Cooking", "Gaming", "Movies",
    "Dancing", "Fashion", "Travel", "Photography", "Art",
    "Writing", "Swimming", "Tech", "Pets",
  ];

  const animate = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.12,
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

  const toggleHobby = (item: string) => {
    animate();
    if (selected.includes(item)) {
      setSelected(selected.filter((h) => h !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const filteredHobbies = hobbies.filter((h) =>
    h.toLowerCase().includes(search.toLowerCase())
  );

const handleNext = async () => {
  try {
    await patchMe({
      interests: selected,
      onboardingStep: 5,
    });

    router.push("/screens/signup/Step6Photos");
  } catch (err: any) {
    console.log("Hobbies update error:", err.message);
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
          {/* Step badge */}
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Step 5 of 6</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>What are your interests?</Text>
          <Text style={styles.subtitle}>
            Pick the hobbies that describe you best.
          </Text>

          {/* Search bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#E1BEE7" />
            <TextInput
              placeholder="Search hobbies..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Chips */}
          <ScrollView
            style={{ marginTop: 18, height: 330 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.chipContainer}>
              {filteredHobbies.map((item, index) => {
                const active = selected.includes(item);
                return (
                  <Pressable key={index} onPress={() => toggleHobby(item)}>
                    <Animated.View
                      style={[
                        styles.chip,
                        {
                          backgroundColor: active
                            ? "rgba(225,190,231,0.25)"
                            : "rgba(255,255,255,0.08)",
                          borderColor: active
                            ? "#E1BEE7"
                            : "rgba(255,255,255,0.25)",
                          transform: [{ scale: active ? scaleAnim : 1 }],
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          { color: active ? "#E1BEE7" : "#FFFFFF" },
                        ]}
                      >
                        {item}
                      </Text>
                    </Animated.View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Continue Button */}
          <Pressable
            disabled={selected.length < 2}
            onPress={handleNext}
            style={{ marginTop: 20 }}
          >
            <View
              style={[
                styles.btn,
                { opacity: selected.length >= 2 ? 1 : 0.4 },
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
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 26,
    paddingVertical: 32,
    paddingHorizontal: 22,
    borderWidth: 2,
    borderColor: "rgba(225,190,231,0.35)",
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
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "serif",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(229,231,235,0.85)",
    marginBottom: 18,
    lineHeight: 20,
  },
  searchBar: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(225,190,231,0.4)",
    backgroundColor: "rgba(15,23,42,0.95)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    marginLeft: 8,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 2,
    margin: 8,
  },
  chipText: {
    fontSize: 15,
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
    fontSize: 18,
    fontWeight: "700",
  },
});