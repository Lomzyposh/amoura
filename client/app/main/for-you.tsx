import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// SAMPLE PROFILES
const PROFILES = [
  {
    id: 1,
    name: "Amara",
    age: 22,
    photo:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    tagline: "Love fashion and soft vibes 💖",
    hobbies: ["Fashion", "Travel", "Coffee"],
  },
  {
    id: 2,
    name: "Jordan",
    age: 24,
    photo:
      "https://plus.unsplash.com/premium_photo-1661724295894-9f4323058501?fm=jpg&q=60&w=3000",
    tagline: "Adventure seeker ✨",
    hobbies: ["Music", "Hiking", "Movies"],
  },
  {
    id: 3,
    name: "Bella",
    age: 21,
    photo:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    tagline: "Music and coffee lover ☕🎶",
    hobbies: ["Music", "Art", "Reading"],
  },
];

export default function ForYou() {
  const router = useRouter();

  const renderItem = ({ item }: any) => (
  <Pressable
    style={styles.card}
    onPress={() => router.push({ pathname: "/profile/[id]", params: { id: item.id.toString() } })}
  >
    <Image source={{ uri: item.photo }} style={styles.image} />

    <View style={styles.overlay}>
      <Text style={styles.tagline}>{item.tagline}</Text>
    </View>

    <View style={styles.likeBtn}>
      <Text style={{ fontSize: 20, color: "#fff" }}>❤️</Text>
    </View>
  </Pressable>
);


  return (
    <View style={styles.container}>
      <Text style={styles.header}>For You</Text>

      <FlatList
        data={PROFILES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B132B",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#EAD0F7",
    fontFamily: "serif",
    marginBottom: 15,
  },
  card: {
    width: (width - 60) / 2,
    height: 230,
    backgroundColor: "#c9acbaff",
    borderRadius: 22,
    marginBottom: 18,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  tagline: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  likeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
    width: 38,
    height: 38,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
