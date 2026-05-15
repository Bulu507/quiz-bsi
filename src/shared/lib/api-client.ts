import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://test-bsi.jolly.my.id",
  withCredentials: false
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  if (config.headers.Authorization) {
    return config;
  }

  const token = window.localStorage.getItem("quiz-bsi-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
