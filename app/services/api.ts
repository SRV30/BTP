const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:8000";

async function request(path: string, options: RequestInit = {}, token?: string) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || "Request failed");
  return data;
}

export const api = {
  signup: (email: string, password: string) => request("/auth/signup", { method: "POST", body: JSON.stringify({ email, password }) }),
  login: (email: string, password: string) => request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  forgotPassword: (email: string) => request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  me: (token: string) => request("/auth/me", {}, token),
  dashboard: (token: string) => request("/dashboard-summary", {}, token),
  logData: (token: string, payload: {screen_time:number;steps:number;sleep:number;streak:number;}) => request('/log-data',{method:'POST',body:JSON.stringify(payload)},token),
};
