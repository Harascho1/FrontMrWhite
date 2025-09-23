import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { Navigate, useNavigate } from "react-router-dom";

export const useRefreshToken = () => {
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const checkAndRefreshToken = async () => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      console.log("Nema tokena, preusmeravam na login...");
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
        const newAccessToken = response.data.token;
        localStorage.setItem("token", newAccessToken);
        console.log("Token uspešno osvežen!");
      } catch (error) {
        console.error("Greška pri osvežavanju tokena:", error);
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }
    }
  };
  useEffect(() => {
    checkAndRefreshToken();

    intervalRef.current = setInterval(checkAndRefreshToken, 5 * 60 * 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
};
