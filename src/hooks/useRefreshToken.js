import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

export const useRefreshToken = () => {
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        return;
      }

      const decodedToken = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;

      const expiresIn = decodedToken.exp - currentTime;

      const refreshThreshold = 300;

      if (expiresIn < refreshThreshold) {
        console.log("Token ističe uskoro, osvežavam ga...");
        try {
          const response = await api.post("users/refresh-token");
          const newAccessToken = response.data.accessToken;
          localStorage.setItem("token", newAccessToken);
          console.log("Token uspešno osvežen!");

          setTimeout(
            checkAndRefreshToken,
            (jwtDecode(newAccessToken).exp - Date.now() / 1000) * 1000 - 300000,
          );
        } catch (error) {
          console.error("Greška pri osvežavanju tokena:", error);
        }
      }
      console.log("radi pls");
    };

    checkAndRefreshToken();

    const intervalId = setInterval(checkAndRefreshToken, 5 * 60 * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
};
