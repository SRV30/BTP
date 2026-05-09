import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://10.17.8.107:8000";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(
      "moodsense_token"
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log(
      "API SUCCESS:",
      response.data
    );

    return response;
  },
  (error) => {
    console.log(
      "API ERROR:",
      error?.response?.data ||
        error.message
    );

    return Promise.reject(error);
  }
);

export const authApi = {
  signup: (payload: any) =>
    api.post("/auth/signup", payload),

  login: (payload: any) =>
    api.post("/auth/login", payload),

  me: () => api.get("/auth/me"),
};

export const profileApi = {
  get: () => api.get("/profile"),

  update: (payload: any) =>
    api.put("/profile", payload),
};

export const logsApi = {
  create: (payload: any) =>
    api.post("/log-data", payload),
};

export const moodApi = {
  today: () => api.get("/today"),

  mood7: () => api.get("/mood/7days"),

  mood30: () => api.get("/mood/30days"),

  predict: () =>
    api.get("/predict-next-day"),

  insights: () =>
    api.get("/ai-insights"),

  depression: () =>
    api.get("/depression-analysis"),
};

export const connectionApi = {
  search: (email: string) =>
    api.get("/connections/search", {
      params: { email },
    }),

  request: (payload: any) =>
    api.post(
      "/connections/request",
      payload
    ),

  respond: (payload: any) =>
    api.post(
      "/connections/request/respond",
      payload
    ),

  list: () =>
    api.get("/connections"),
};

export const locationApi = {
  search: (params: any) =>
    api.get("/location-search", {
      params,
    }),
};