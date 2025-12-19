import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

type ChatInputProps = {
  message: string;
  onChangeMessage: (text: string) => void;
  onSend: () => void;
  onAiPress: () => void;
};

export default function ChatInput({ message, onChangeMessage, onSend, onAiPress }: ChatInputProps) {
  return (
    <View style={styles.inputContainer}>
      {/* AI Assist */}
      <TouchableOpacity style={styles.aiButton} onPress={onAiPress}>
        <Text style={styles.aiIcon}>🤖</Text>
      </TouchableOpacity>

      {/* Text Input */}
      <TextInput
        value={message}
        onChangeText={onChangeMessage}
        placeholder="Type a message…"
        placeholderTextColor="rgba(209,213,219,0.6)"
        style={styles.input}
        multiline
        returnKeyType="send"
        onSubmitEditing={onSend}
      />

      {/* Send Button */}
      <TouchableOpacity style={styles.sendButton} onPress={onSend}>
        <Text style={styles.sendText}>➤</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  aiButton: { marginRight: 6 },
  aiIcon: { fontSize: 20 },
  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#FFFFFF",
    fontSize: 15,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#5B5FFF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sendText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
