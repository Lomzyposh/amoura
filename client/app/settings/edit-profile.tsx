import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { getMe, patchMe } from "../api"; // <-- adjust
import { KeyboardAvoidingView, Platform } from "react-native";

// ===== Theme (same as Settings) =====
const BG = "#070A17";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(255,255,255,0.10)";
const TEXT = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.68)";
const ACCENT = "#EAD0F7";

const GENDER_OPTIONS = [
  { label: "Select gender…", value: "" },
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Non-binary", value: "nonbinary" },
  { label: "Other", value: "other" },
];

const INTERESTED_IN_OPTIONS = [
  { label: "Select preference…", value: "" },
  { label: "Men", value: "male" },
  { label: "Women", value: "female" },
  { label: "Everyone", value: "everyone" },
];

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Note: interestedInPicker is a SINGLE value, but DB expects ARRAY
  const [form, setForm] = useState({
    name: "",
    gender: "",
    interestedInPicker: "",
    bio: "",
    interestsText: "",
    // location not edited here because schema expects Geo coords; we can add later with GPS
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const interestsArray = useMemo(
    () =>
      form.interestsText
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    [form.interestsText]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const me = await getMe();

        // interestedIn stored as array e.g. ["everyone"] or ["male"]
        const pref = Array.isArray(me?.interestedIn) ? me.interestedIn[0] : "";

        setForm({
          name: me?.name || "",
          gender: normalizeValue(me?.gender),
          interestedInPicker: normalizeValue(pref),
          bio: me?.bio || "",
          interestsText: Array.isArray(me?.interests)
            ? me.interests.join(", ")
            : "",
        });

        await AsyncStorage.setItem("amoura_user", JSON.stringify(me));
      } catch (e) {
        // fallback to cached user
        const raw = await AsyncStorage.getItem("amoura_user");
        if (raw) {
          const parsed = JSON.parse(raw);
          const pref = Array.isArray(parsed?.interestedIn)
            ? parsed.interestedIn[0]
            : "";

          setForm({
            name: parsed?.name || "",
            gender: normalizeValue(parsed?.gender),
            interestedInPicker: normalizeValue(pref),
            bio: parsed?.bio || "",
            interestsText: Array.isArray(parsed?.interests)
              ? parsed.interests.join(", ")
              : "",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const saveChanges = async () => {
    try {
      if (!form.name.trim()) {
        Alert.alert("Hold up 😄", "Name can’t be empty.");
        return;
      }

      setSaving(true);

      // ✅ Convert dropdown single value -> DB array
      // If user picked nothing, don’t send it (so backend doesn’t overwrite)
      const interestedInArr = form.interestedInPicker.trim()
        ? [form.interestedInPicker.trim()]
        : undefined;

      const payload: any = {
        name: form.name.trim(),
        gender: form.gender.trim() || undefined,
        interestedIn: interestedInArr,
        bio: form.bio.trim(),
        interests: interestsArray,
      };

      const updatedUser = await patchMe(payload);
      await AsyncStorage.setItem("amoura_user", JSON.stringify(updatedUser));

      Alert.alert("Saved ✨", "Your profile has been updated.");
      router.back();
    } catch (err: any) {
      Alert.alert("Couldn’t save", err?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator />
        <Text style={{ color: MUTED, marginTop: 10 }}>
          Loading your profile…
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.8 },
            ]}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={22} color={TEXT} />
          </Pressable>

          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Field label="Name">
            <TextInput
              value={form.name}
              onChangeText={(v) => update("name", v)}
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor="rgba(255,255,255,0.35)"
            />
          </Field>

          <Field label="Gender">
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={form.gender}
                onValueChange={(v) => update("gender", String(v))}
                style={styles.picker}
                dropdownIconColor="rgba(255,255,255,0.65)"
              >
                {GENDER_OPTIONS.map((o) => (
                  <Picker.Item
                    key={o.value}
                    label={o.label}
                    value={o.value}
                    color={BG}
                  />
                ))}
              </Picker>
            </View>
          </Field>

          <Field label="Interested In">
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={form.interestedInPicker}
                onValueChange={(v) => update("interestedInPicker", String(v))}
                style={styles.picker}
                dropdownIconColor="rgba(255,255,255,0.65)"
              >
                {INTERESTED_IN_OPTIONS.map((o) => (
                  <Picker.Item
                    key={o.value}
                    label={o.label}
                    value={o.value}
                    color={BG}
                  />
                ))}
              </Picker>
            </View>
          </Field>

          <Field label="Bio">
            <TextInput
              value={form.bio}
              onChangeText={(v) => update("bio", v)}
              style={[styles.input, { height: 92, paddingTop: 12 }]}
              placeholder="Say something cool…"
              placeholderTextColor="rgba(255,255,255,0.35)"
              multiline
            />
          </Field>

          <Field
            label="Interests (comma separated)"
            hint="This maps to your schema: interests: [String]"
          >
            <TextInput
              value={form.interestsText}
              onChangeText={(v) => update("interestsText", v)}
              style={styles.input}
              placeholder="e.g. Music, Football, Movies"
              placeholderTextColor="rgba(255,255,255,0.35)"
            />
          </Field>
        </View>

        {/* Save */}
        <Pressable
          style={({ pressed }) => [
            styles.saveBtn,
            pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
            saving && { opacity: 0.6 },
          ]}
          onPress={saveChanges}
          disabled={saving}
        >
          {saving ? (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <ActivityIndicator />
              <Text style={styles.saveText}>Saving…</Text>
            </View>
          ) : (
            <Text style={styles.saveText}>Save Changes</Text>
          )}
        </Pressable>

        <View style={{ height: 28 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function normalizeValue(v: any) {
  if (typeof v !== "string") return "";
  return v.trim().toLowerCase();
}

function Field({ label, hint, children }: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      {!!hint && <Text style={styles.hint}>{hint}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: 55,
    paddingHorizontal: 10,
  },
  content: { paddingTop: 18, paddingHorizontal: 16 },
  center: { justifyContent: "center", alignItems: "center" },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: ACCENT,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.2,
    fontFamily: "serif",
  },

  card: {
    backgroundColor: CARD,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
  },

  label: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 6,
    marginLeft: 2,
  },
  hint: {
    color: MUTED,
    fontSize: 12.5,
    marginTop: -2,
    marginBottom: 8,
    marginLeft: 2,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: TEXT,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  pickerWrap: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    overflow: "hidden",
  },
  picker: { color: TEXT, width: "100%" },

  saveBtn: {
    marginTop: 14,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(234,208,247,0.35)",
    backgroundColor: "rgba(234,208,247,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    color: TEXT,
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 0.4,
  },
});
