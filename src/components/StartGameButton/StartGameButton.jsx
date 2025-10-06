import { useEffect } from "react";
import { useState } from "react";
import api from "../../services/api";

async function fetchIsOwner(token, key) {
  try {
    const response = await api.get(`/users/isOwner/${key}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const isOwner = await response.data.isOwner;
    console.log(isOwner);
    return isOwner;
  } catch (err) {
    console.error(err);
    return false;
  }
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
        action: "init_game",
        key: key,
        token: token,
      }),
    );
  };
  return isUserOwner ? (
    <button onClick={handleStartGame}>Start Game</button>
  ) : null;
}
