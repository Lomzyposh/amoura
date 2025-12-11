import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function EditProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>({
    name: "",
    age: "",
    gender: "",
    bio: "",
    location: "",
    hobbies: "",
    interests: "",
    lookingFor: "",
  });

  useEffect(() => {
    const loadData = async () => {
      const raw = await AsyncStorage.getItem("amoura_user");
      if (raw) {
        const parsed = JSON.parse(raw);

        setUser({
          name: parsed.name || "",
          age: parsed.age?.toString() || "",
          gender: parsed.gender || "",
          bio: parsed.bio || "",
          location: parsed.location || "",
          hobbies: parsed.hobbies?.join(", ") || "",
          interests: parsed.interests?.join(", ") || "",
          lookingFor: parsed.lookingFor || "",
        });
      }
    };

    loadData();
  }, []);

  const saveChanges = async () => {
    try {
      const updated = {
        ...user,
        age: parseInt(user.age) || null,
        hobbies: user.hobbies.split(",").map((x) => x.trim()),
        interests: user.interests.split(",").map((x) => x.trim()),
      };

      await AsyncStorage.setItem("amoura_user", JSON.stringify(updated));

      router.back();
    } catch (err) {
      console.log("SAVE ERROR:", err);
    }
  };

  const update = (key: string, value: string) => {
    setUser((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* FORM */}
      <View style={styles.card}>
        <Field label="Name" value={user.name} onChange={(v) => update("name", v)} />
        <Field label="Age" value={user.age} onChange={(v) => update("age", v)} keyboard="numeric" />
        <Field label="Gender" value={user.gender} onChange={(v) => update("gender", v)} />
        <Field label="Bio" value={user.bio} onChange={(v) => update("bio", v)} multiline />

        <Field label="Location" value={user.location} onChange={(v) => update("location", v)} />

        <Field
          label="Hobbies (comma separated)"
          value={user.hobbies}
          onChange={(v) => update("hobbies", v)}
        />

        <Field
          label="Interests (comma separated)"
          value={user.interests}
          onChange={(v) => update("interests", v)}
        />

        <Field
          label="Looking For"
          value={user.lookingFor}
          onChange={(v) => update("lookingFor", v)}
        />
      </View>

      {/* SAVE BUTTON */}
      <Pressable style={styles.saveBtn} onPress={saveChanges}>
        <Text style={styles.saveText}>Save Changes</Text>
      </Pressable>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

/* COMPONENT: INPUT FIELD */
function Field({ label, value, onChange, multiline = false, keyboard }: any) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        keyboardType={keyboard}
        style={[styles.input, multiline && { height: 80 }]}
        placeholderTextColor="#64748B"
      />
    </View>
  );
}

/* ====== STYLES ====== */

const CARD_BG = "rgba(15,23,42,0.92)";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 18,
    paddingTop: 55,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },

  label: {
    color: "#E5E7EB",
    marginBottom: 6,
    fontSize: 13,
  },

  input: {
    backgroundColor: "rgba(30,41,59,0.6)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.35)",
  },

  saveBtn: {
    backgroundColor: "#EC4899",
    marginTop: 25,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 16,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
