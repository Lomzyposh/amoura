import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import ChatInput from "./chatInput";
import { analyzeMessage } from "./ai/aiAnalyzer";
import { storeAnalysis } from "./ai/aiMemory";

type Message = {
  id: string;
  text: string;
  sender: "me" | "them";
};

export default function ChatRoom() {
  const { chatId, name } = useLocalSearchParams<{
    chatId: string;
    name?: string;
  }>();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hey 😊 I really liked your profile", sender: "them" },
    { id: "2", text: "Thank you! Yours caught my attention too", sender: "me" },
  ]);

  const [showAiModal, setShowAiModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!message.trim()) return;

    const analysis = analyzeMessage(message);
    storeAnalysis(chatId, analysis);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: message,
        sender: "me",
      },
    ]);

    setMessage("");
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{name ?? "Chat"}</Text>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isMe = item.sender === "me";
            return (
              <View
                style={[
                  styles.messageBubble,
                  isMe ? styles.myMessage : styles.theirMessage,
                ]}
              >
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            );
          }}
          contentContainerStyle={styles.messagesContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <ChatInput
          message={message}
          onChangeMessage={setMessage}
          onSend={handleSend}
          onAiPress={() => setShowAiModal(true)}
        />

        {/* AI Assist Modal */}
        <Modal visible={showAiModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>AI Suggestions</Text>
              <Text style={styles.modalText}>
                AI will analyze this chat and suggest replies.
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAiModal(false)}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B132B",
    paddingHorizontal: 2,
    paddingTop: 40,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#EAD0F7",
    fontFamily: "serif",
    marginBottom: 15,
  },
  messagesContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#5B5FFF",
    borderTopRightRadius: 4,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderTopLeftRadius: 4,
  },
  messageText: { color: "#FFFFFF", fontSize: 15, lineHeight: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#1E1E2F",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  modalText: { color: "#FFFFFF", fontSize: 15, marginBottom: 20 },
  closeButton: {
    backgroundColor: "#5B5FFF",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  closeText: { color: "#FFFFFF", fontWeight: "600", fontSize: 15 },
});
