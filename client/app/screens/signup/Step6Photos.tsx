import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Animated,
  Dimensions,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { patchMe } from "@/app/api";
import { uploadToCloudinary } from "@/utils/cloudinary";


const { width } = Dimensions.get("window");
const CARD_MAX = 430;

export default function Step6Photos() {
  const router = useRouter();

  const [photos, setPhotos] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]); // 5 spots for Option B layout

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animate = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.08,
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

  const pickImage = async (index: number) => {
    animate();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const arr = [...photos];
      arr[index] = uri;
      setPhotos(arr);
    }
  };

  const canContinue = photos.some((p) => p !== null);

const handleContinue = async () => {
  try {
    // Filter out empty slots
    const selected = photos.filter((p) => p !== null) as string[];

    // Upload each to Cloudinary
    const uploadedUrls: string[] = [];
    for (const uri of selected) {
      const url = await uploadToCloudinary(uri);
      uploadedUrls.push(url);
    }

    // Format for backend
    const formatted = uploadedUrls.map((url, index) => ({
      url,
      order: index,
    }));

    await patchMe({
      photos: formatted,
      onboardingStep: 6,
    });

    router.push("/screens/signup/Step7Bio");
  } catch (err: any) {
    console.log("Photo upload error:", err.message);
  }
};


  return (
    <ImageBackground
      source={{
        uri: "https://cdn.pixabay.com/photo/2017/07/31/18/11/people-2559659_1280.jpg",
      }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["#0B132B", "#2E1A3F", "#1A0E24"]}
        style={styles.overlay}
      />

      <View style={styles.container}>
        <View style={styles.card}>
          {/* Step badge */}
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Step 6 of 7</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Add your photos</Text>
          <Text style={styles.subtitle}>
            Your first photo is your main profile picture.
          </Text>

          {/* MAIN IMAGE LARGE */}
          <Pressable
            onPress={() => pickImage(0)}
            style={[
              styles.mainPhoto,
              !photos[0] && styles.emptyBox,
              photos[0] && styles.filledBox,
            ]}
          >
            {photos[0] ? (
              <Image source={{ uri: photos[0] }} style={styles.photo} />
            ) : (
              <Text style={styles.plus}>+</Text>
            )}
          </Pressable>

          {/* 2 MEDIUM IMAGES */}
          <View style={styles.row}>
            {[1, 2].map((i) => (
              <Pressable
                key={i}
                onPress={() => pickImage(i)}
                style={[
                  styles.mediumPhoto,
                  !photos[i] && styles.emptyBox,
                  photos[i] && styles.filledBox,
                ]}
              >
                {photos[i] ? (
                  <Image source={{ uri: photos[i] }} style={styles.photo} />
                ) : (
                  <Text style={styles.plusSmall}>+</Text>
                )}
              </Pressable>
            ))}
          </View>

          {/* 2 SMALL IMAGES */}
          <View style={styles.row}>
            {[3, 4].map((i) => (
              <Pressable
                key={i}
                onPress={() => pickImage(i)}
                style={[
                  styles.smallPhoto,
                  !photos[i] && styles.emptyBox,
                  photos[i] && styles.filledBox,
                ]}
              >
                {photos[i] ? (
                  <Image source={{ uri: photos[i] }} style={styles.photo} />
                ) : (
                  <Text style={styles.plusSmall}>+</Text>
                )}
              </Pressable>
            ))}
          </View>

          {/* Continue Button */}
          <Pressable
            disabled={!canContinue}
            onPress={() => handleContinue()}
            style={{ marginTop: 28 }}
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
    width: cardWidth,
    alignSelf: "center",
    // backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 26,
    paddingVertical: 34,
    paddingHorizontal: 22,
    // borderWidth: 2,
    // borderColor: "rgba(225,190,231,0.35)",
    // shadowColor: "#E1BEE7",
    // shadowOpacity: 0.25,
    // shadowRadius: 18,
  },

  stepBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderRadius: 999,
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
    color: "#fff",
    fontWeight: "700",
    fontFamily: "serif",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "rgba(229,231,235,0.85)",
    marginBottom: 25,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    gap: 14,
  },

  mainPhoto: {
    width: "100%",
    height: cardWidth * 0.6,
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  mediumPhoto: {
    width: (cardWidth - 40) / 2,
    height: 130,
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  smallPhoto: {
    width: (cardWidth - 40) / 2,
    height: 110,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyBox: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.25)",
  },

  filledBox: {
    borderColor: "#E1BEE7",
  },

  plus: {
    color: "#fff",
    fontSize: 46,
    opacity: 0.7,
  },

  plusSmall: {
    color: "#fff",
    fontSize: 32,
    opacity: 0.7,
  },

  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
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
