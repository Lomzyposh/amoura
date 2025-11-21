import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function LikeYouScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Like You</Text>
      <Text style={styles.text}>
        This will show people who already liked you – grid layout like the
        design.
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
