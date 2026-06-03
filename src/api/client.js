const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = async (path, options = {}, token) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const payload = await response.json().catch(() => ({ success: false, message: "Invalid server response" }));
  if (!response.ok) throw new Error(payload.message || "Request failed");
  return payload;
};
