import { useEffect, useState } from "react";
import "./UserProfile.css";

export function UserProfile() {
  const [isLogIn, setLogIn] = useState(false);
  const [username, setUsername] = useState("");

  const checkIsLogIn = () => {
    const token = localStorage.getItem("token");
    if (token === "") {
      setLogIn(false);
      return;
    }
    fetch("http://localhost:8080/api/v1/users/getUsername", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
        setLogIn(true);
      })
      .catch((err) => {
        console.error(err);
        setLogIn(false);
      });
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
