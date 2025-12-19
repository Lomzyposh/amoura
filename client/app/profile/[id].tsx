 import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

const PROFILES = [
  {
    id: "1",
    name: "Medina Amandel",
    age: 29,
    photo:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    hobbies: [
      { name: "Game", icon: "🎮" },
      { name: "Singing", icon: "🎤" },
      { name: "Anime", icon: "🇯🇵" },
      { name: "Pargoy", icon: "🕺" },
      { name: "Rendang Lovers", icon: "🍛" },
      { name: "Kayang", icon: "🤸‍♀️" },
      { name: "Terong", icon: "🍆" },
      { name: "Yoga", icon: "🧘‍♂️" },
      { name: "Ramen", icon: "🍜" },
    ],
    bio: "Outdoor lover, coffee enthusiast, and amateur chef. Passionate about exploring new places and capturing moments. Seeking a partner for adventures and meaningful conversations. Let’s make memories together! 🌟",
    gallery: [
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      "https://plus.unsplash.com/premium_photo-1661724295894-9f4323058501?fm=jpg&q=60&w=3000",
    ],
    distance: "200 m",
    matchedPreferences: "5+ Preferences",
  },

  {
    id: "2",
    name: "Medina Amandel",
    age: 29,
    photo:
     "https://plus.unsplash.com/premium_photo-1661724295894-9f4323058501?fm=jpg&q=60&w=3000",
    hobbies: [
      { name: "Game", icon: "🎮" },
      { name: "Singing", icon: "🎤" },
      { name: "Anime", icon: "🇯🇵" },
      { name: "Pargoy", icon: "🕺" },
      { name: "Rendang Lovers", icon: "🍛" },
      { name: "Kayang", icon: "🤸‍♀️" },
      { name: "Terong", icon: "🍆" },
      { name: "Yoga", icon: "🧘‍♂️" },
      { name: "Ramen", icon: "🍜" },
    ],
    bio: "Outdoor lover, coffee enthusiast, and amateur chef. Passionate about exploring new places and capturing moments. Seeking a partner for adventures and meaningful conversations. Let’s make memories together! 🌟",
    gallery: [
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      "https://plus.unsplash.com/premium_photo-1661724295894-9f4323058501?fm=jpg&q=60&w=3000",
    ],
    distance: "200 m",
    matchedPreferences: "5+ Preferences",
  },

  {
    id: "3  ",
    name: "Medina Amandel",
    age: 29,
    photo:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    hobbies: [
      { name: "Game", icon: "🎮" },
      { name: "Singing", icon: "🎤" },
      { name: "Anime", icon: "🇯🇵" },
      { name: "Pargoy", icon: "🕺" },
      { name: "Rendang Lovers", icon: "🍛" },
      { name: "Kayang", icon: "🤸‍♀️" },
      { name: "Terong", icon: "🍆" },
      { name: "Yoga", icon: "🧘‍♂️" },
      { name: "Ramen", icon: "🍜" },
    ],
    bio: "Outdoor lover, coffee enthusiast, and amateur chef. Passionate about exploring new places and capturing moments. Seeking a partner for adventures and meaningful conversations. Let’s make memories together! 🌟",
    gallery: [
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      "https://plus.unsplash.com/premium_photo-1661724295894-9f4323058501?fm=jpg&q=60&w=3000",
    ],
    distance: "200 m",
    matchedPreferences: "5+ Preferences",
  },
];

export default function ProfileDetails() {
  const { id } = useLocalSearchParams();
  const profile = PROFILES.find((p) => p.id === id);

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Profile not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Top Image with overlay */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: profile.photo }} style={styles.photo} />
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{profile.distance}</Text>
        </View>
        <View style={styles.nameWrapper}>
          <Text style={styles.name}>
            {profile.name}, {profile.age} <Text style={styles.verified}>✔️</Text>
          </Text>
          <Text style={styles.matched}>{`Matched ${profile.matchedPreferences}`}</Text>
        </View>
      </View>

      {/* About / Bio */}
      <Text style={styles.sectionHeader}>About</Text>
      <Text style={styles.bio}>{profile.bio}</Text>

      {/* Hobbies / Badges */}
      <View style={styles.badgesContainer}>
        {profile.hobbies.map((hobby, idx) => (
          <View key={idx} style={styles.badge}>
            <Text style={styles.badgeText}>
              {hobby.icon} {hobby.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Gallery */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
        {profile.gallery.map((img, idx) => (
          <Image key={idx} source={{ uri: img }} style={styles.galleryImg} />
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B132B",
  },
  header: {
    color: "#000",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 50,
  },
  imageWrapper: {
    position: "relative",
  },
  photo: {
    width: "100%",
    height: 400,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  distanceBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  distanceText: {
    color: "#fff",
    fontSize: 14,
  },
  nameWrapper: {
    position: "absolute",
    bottom: 15,
    left: 15,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0B132B",
  },
  verified: {
    fontSize: 20,
    color: "#1E90FF",
  },
  matched: {
    color: "#fff",
    fontSize: 14,
    marginTop: 3,
  },
  sectionHeader: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
    marginLeft: 15,
  },
  bio: {
    color: "#FFF",
    fontSize: 16,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 15,
    marginBottom: 15,
  },
  badge: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 25,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: "#000",
    fontSize: 14,
  },
  gallery: {
    marginHorizontal: 15,
    marginBottom: 30,
  },
  galleryImg: {
    width: width / 3,
    height: 120,
    borderRadius: 15,
    marginRight: 10,
  },
});
