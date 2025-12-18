// api.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://10.157.94.54:5000/api";

async function authHeaders() {
  const token = await AsyncStorage.getItem("amoura_token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export async function postJSON(path: string, body: any) {
  const url = `${API_BASE_URL}${path}`;
  console.log("➡️ Requesting:", url);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  let data: any;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(
      `Non-JSON from server (status ${res.status}). First char: ${text[0]}`
    );
  }

  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export async function getMe() {
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: await authHeaders(),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to load profile");
  return json;
}

export async function patchMe(data: any) {
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PATCH",
    headers: await authHeaders(),
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Update failed");
  return json;
}

export async function requestPasswordReset(email: string) {
  return postJSON("/auth/forgot-password", { email });
}

export async function resetPasswordWithCode(data: {
  email: string;
  code: string;
  newPassword: string;
}) {
  return postJSON("/auth/reset-password", data);
}

export async function postAuthed(path: string, body: any) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json;
}

// Verification endpoints
export const requestEmailOtp = (email?: string) =>
  postAuthed("/verification/email/request", { email });

export const confirmEmailOtp = (code: string) =>
  postAuthed("/verification/email/confirm", { code });

export const requestPhoneOtp = (phone: string) =>
  postAuthed("/verification/phone/request", { phone });

export const confirmPhoneOtp = (code: string) =>
  postAuthed("/verification/phone/confirm", { code });

export async function createReport(payload: { reason: string; note?: string }) {
  return postAuthed("/reports", payload); // uses auth token
}

export async function getBlockedUsers() {
  const res = await fetch(`${API_BASE_URL}/blocks`, {
    method: "GET",
    headers: await authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to load blocked users");
  return json; // { blockedUsers }
}

export async function unblockUser(userId: string) {
  const res = await fetch(`${API_BASE_URL}/blocks/${userId}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to unblock user");
  return json;
}
