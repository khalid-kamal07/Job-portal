import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 20000,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tb_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const errorMessage = (error) =>
  error?.response?.data?.message ||
  (error?.code === "ERR_NETWORK"
    ? "Cannot connect to the API. Check that the backend is running."
    : "Something went wrong. Please try again.");
export default api;
