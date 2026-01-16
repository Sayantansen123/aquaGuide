import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import config from "@/api/config";
import store from "@/store/store";
import { logout } from "@/store/userSlice";

// Custom config type for Axios with optional auth token
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  useAuth?: boolean;
  useRefreshToken?: boolean; // Flag to indicate if auth is needed
}

const httpClient = axios.create({
  baseURL: config.baseUrl,
  timeout: 180000,
  headers: {
    // "Content-Type": "application/x-www-form-urlencoded",
    "ngrok-skip-browser-warning": "69420",
    "Content-Type": "application/json",
  },
});

// Request Interceptor to attach token if required
httpClient.interceptors.request.use(
  (config) => {
	  if (config.url && config.url.startsWith('/api/')) {
      config.url = config.url.replace('/api/', '/'); // removes "/api" but keeps the rest
    }
    const customConfig = config as any;
    const needsAuth = customConfig.useAuth || customConfig.headers?.useAuth;
	if (needsAuth) {
      const token = customConfig.useRefreshToken
          ? localStorage.getItem("refreshToken")
          : localStorage.getItem("accessToken");

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    config.withCredentials = true; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for error handling
httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      // Dispatch logout action to Redux
      store.dispatch(logout());

      // Redirect to login page
      window.location.href = "/#/login";
    }
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default httpClient;
