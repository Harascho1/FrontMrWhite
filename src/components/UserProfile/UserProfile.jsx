import { useEffect, useState } from "react";
import "./UserProfile.css";
import api from "../../services/api";

export function UserProfile() {
  const [isLogIn, setLogIn] = useState(false);
  const [username, setUsername] = useState("");

  const checkIsLogIn = () => {
    const token = localStorage.getItem("token");
    if (token === "") {
      setLogIn(false);
      return;
    }
    try {
      const response = api.get(`/users/getUsername`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsername(response.data.username);
      setLogIn(true);
    } catch (err) {
      console.error(err);
      setLogIn(false);
    }
  };

  useEffect(checkIsLogIn, []);

  return (
    <>
      <div className="user-box">
        <p>{username}</p>
      </div>
    </>
  );
}
