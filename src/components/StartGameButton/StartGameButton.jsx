import { useEffect } from "react";
import { useState } from "react";

async function fetchIsOwner(token, key) {
  return fetch(`http://localhost:8080/api/v1/users/isOwner/${key}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        console.error("result is not ok!");
        return;
      }
      return res.json();
    })
    .then((data) => {
      return data.isOwner;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
}

export default function StartGameButton({ ws }) {
  const key = window.location.pathname.split("/lobby/")[1];
  const token = localStorage.getItem("token");
  // Need to add alert window
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [isUserOwner, setIsUserOwner] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }
    fetchIsOwner(token, key).then((ownerStatus) => {
      setIsUserOwner(ownerStatus);
    });
  }, [token, key]);

  const handleStartGame = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!token) {
      setAlertOpen(true);
      return;
    }
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }
    ws.send(
      JSON.stringify({
        action: "start_game",
        key: key,
        token: token,
      }),
    );
  };
  return isUserOwner ? (
    <button onClick={handleStartGame}>Start Game</button>
  ) : null;
}
