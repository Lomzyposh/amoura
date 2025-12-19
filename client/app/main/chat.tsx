// ChatsList.tsx
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

type ChatPreview = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
};

const chats: ChatPreview[] = [
  {
    id: "1",
    name: "Amoura Match",
    lastMessage: "Thank you! Yours caught my attention too",
    time: "2m",
  },
  {
    id: "2",
    name: "Sophia",
    lastMessage: "That sounds interesting 😊",
    time: "1h",
  },
];

export default function ChatsList() {
  const navigation = useNavigation<any>();

  const renderItem = ({ item }: { item: ChatPreview }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        router.push({
          pathname: "../chat/ChatRoom",
          params: { chatId: item.id, name: item.name },
        })
      }
    >
      <View style={styles.avatar} />
      <View style={styles.chatInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Chats</Text>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B132B", padding: 20 },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#EAD0F7",
    marginBottom: 20,
    fontFamily: "serif",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#5B5FFF",
    marginRight: 12,
  },
  chatInfo: { flex: 1 },
  name: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  lastMessage: {
    color: "rgba(209,213,219,0.8)",
    fontSize: 14,
    marginTop: 4,
  },
  time: { color: "rgba(209,213,219,0.6)", fontSize: 12 },
});
