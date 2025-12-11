import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

const ACTIVE_COLOR = "#EC4899"; // Pink
const INACTIVE_COLOR = "rgba(148,163,184,0.85)"; // Slate
const BG_COLOR = "#0B132B";

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: BG_COLOR,
          borderTopColor: "rgba(15,23,42,0.9)",
          height: Platform.OS === "ios" ? 80 : 70,
          paddingBottom: Platform.OS === "ios" ? 18 : 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Prevent route listing index.jsx */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />

      {/* FOR YOU */}
      <Tabs.Screen
        name="for-you"
        options={{
          title: "For You",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flame" size={size} color={color} />
          ),
        }}
      />

      {/* LIKE YOU */}
      <Tabs.Screen
        name="like-you"
        options={{
          title: "Like You",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-circle" size={size} color={color} />
          ),
        }}
      />

      {/* CHAT (user chats) */}
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
        }}
      />

      {/* ⭐ AI ASSISTANT — NEW TAB */}
      <Tabs.Screen
        name="ai"
        options={{
          title: "AI",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles" size={size} color={color} />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
