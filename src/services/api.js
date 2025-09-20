import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    const response = await api.post("users/refresh-token");
    return response.data.accessToken;
  } catch (error) {
    console.error("Neuspešno osvežavanje tokena:", error);
    //Maybe send client back to modal
  }
};

api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;

      const decodedToken = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime - 60) {
        console.log("Access token je istekao. Pokušavam da ga osvežim...");
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          localStorage.setItem("token", newAccessToken);
          config.headers.Authorization = `Bearer ${newAccessToken}`;
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
