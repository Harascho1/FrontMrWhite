import { header } from "framer-motion/client";
import { useEffect, useState } from "react";
import { UserProfile } from "../../components/UserProfile/UserProfile";
import "./Lobby.css";

function useLobbyPlayers() {
  const [players, setPlayers] = useState([]);
  useEffect(() => {
    const key = window.location.pathname.split("/lobby/")[1];
    const ws = new WebSocket(`ws://localhost:8080/api/v1/gameroom/ws`);
    ws.onopen = () => {
      console.log("Connected to WebSocket");
      ws.send(
        JSON.stringify({
          action: "join",
          key: key,
          token: localStorage.getItem("token"),
        }),
      );
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPlayers(data.players);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
    return () => ws.close();
  }, []);

  return players;
}

export default function Lobby() {
  const [valid, setValid] = useState(null);

  useEffect(() => {
    const key = window.location.pathname.split("/lobby/")[1];
    fetch(`http://localhost:8080/api/v1/room/isExist/${key}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          setValid(true);
          return;
        } else {
          setValid(false);
          return;
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return <>{valid ? <ValidLobby /> : <InvalidLobby />}</>;
}

function InvalidLobby() {
  return <h1 style={{ textAlign: "center" }}>Invalid Invation Link</h1>;
}

function ValidLobby() {
  const players = useLobbyPlayers();
  return (
    <>
      <h1 style={{ textAlign: "center" }}>You are in lobby</h1>
      <UserProfile />
      <div className="players-box">
        <h2>Players:</h2>
        <ul>
          {players.map((name, idx) => (
            <li key={idx}>{name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
