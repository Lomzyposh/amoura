import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ForYouScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>For You</Text>
      <Text style={styles.text}>
        Here you can later show curated suggestions based on interests,
        location, and behavior.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B132B",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  text: {
    color: "rgba(209,213,219,0.9)",
    fontSize: 15,
  },
});
