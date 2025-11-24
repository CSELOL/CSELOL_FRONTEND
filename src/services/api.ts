import axios from "axios";

// Create Axios Instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (Attach Token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Or get from Keycloak
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- MOCK ADAPTER (For Development without Backend) ---
// In a real scenario, you would remove this block or use a library like 'axios-mock-adapter'
// This is a simple manual override for demonstration purposes.

const MOCK_DELAY = 800;

export const mockRequest = <T>(data: T, shouldFail = false): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Mock Error: Request failed"));
      } else {
        resolve(data);
      }
    }, MOCK_DELAY);
  });
};
