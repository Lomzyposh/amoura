import AsyncStorage from "@react-native-async-storage/async-storage";
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://10.157.94.54:5000/api";
// 10.0.2.2 = Android emulator talking to your localhost
// Change to your LAN IP like "http://192.168.x.x:5000/api" when testing on device
export async function postJSON(path: string, body: any) {
  const url = `${API_BASE_URL}${path}`;
  console.log("➡️ Requesting:", url);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  console.log("⬅️ Raw response:", text);

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(
      `Non-JSON from server (status ${res.status}). First char: ${text[0]}`
    );
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function patchMe(data: any) {
  const token = await AsyncStorage.getItem("amoura_token");

  const res = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Update failed");
  }

  return json;
}
