import { useEffect, useRef, useState } from "react";
import { UserProfile } from "../../components/UserProfile/UserProfile";
import "./Lobby.css";
import StartGameButton from "../../components/StartGameButton/StartGameButton";
import MessageTextBox from "../../components/MessageTextBox/MessageTextBox";
import ChatDisplay from "../../components/ChatDisplay/ChatDisplay";

function useWebSocket(url) {
  const [readyState, setReadyState] = useState(WebSocket.CONNECTING);
  const [lastMessage, setLastMessage] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);
    ws.current.onopen = () => setReadyState(WebSocket.OPEN);
    ws.current.onclose = () => setReadyState(WebSocket.CLOSED);
    ws.current.onmessage = (event) => setLastMessage(event);
    ws.current.onerror = (err) => console.error("WebSocket error:", err);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const send = (data) => {
    if (ws && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(data);
    } else {
      console.error("WebSocket is not connected");
    }
  };

  return { send, readyState, lastMessage };
}

function useLobbyPlayers() {
  const [players, setPlayers] = useState([]);
  const [isValid, setIsValid] = useState(null);
  const [messages, setMessages] = useState([]);
  const { send, readyState, lastMessage } = useWebSocket(
    `ws://localhost:8080/api/v1/gameroom/ws`,
  );

  useEffect(() => {
    if (readyState === WebSocket.OPEN) {
      const key = window.location.pathname.split("/lobby/")[1];
      const token = localStorage.getItem("token");
      send(
        JSON.stringify({
          action: "join",
          key: key,
          token: token,
        }),
      );
    }
  }, [readyState, send]);

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        if (data.error) {
          console.error(data.error);
          return;
        }
        if (data.action === "room_status") {
          setIsValid(data.isValid);
          if (data.isValid) {
            setPlayers(data.players);
          }
        } else if (data.action === "player_list") {
          setPlayers(data.players);
        } else if (data.action === "game_status") {
          console.log(data.status);
        } else if (data.action === "chat_message") {
          setMessages((prevMessages) => {
            const updatedMsgs = [...prevMessages, data.msg];
            //if (updatedMsgs.length > 5) {
            //  return updatedMsgs.slice(1);
            //}
            return updatedMsgs;
          });
          console.log(data.msg);
        }
      } catch (err) {
        console.error("Failed to parse message:", err);
      }
    }
  }, [lastMessage]);

  const sendMessage = (messageText) => {
    const key = window.location.pathname.split("/lobby/")[1];
    const token = localStorage.getItem("token");
    send(
      JSON.stringify({
        action: "send_chat",
        key: key,
        token: token,
        msg: messageText,
      }),
    );
  };

  return { players, isValid, sendMessage, messages, send, readyState };
}

export default function Lobby() {
  const { players, isValid, sendMessage, messages, send, readyState } =
    useLobbyPlayers();

  if (!isValid) {
    return <InvalidLobby />;
  }
  return (
    <ValidLobby
      players={players}
      send={send}
      readyState={readyState}
      sendMessage={sendMessage}
      messages={messages}
    />
  );
}

function InvalidLobby() {
  return <h1 style={{ textAlign: "center" }}>Invalid Invation Link</h1>;
}

function ValidLobby({ players, messages, sendMessage, send, readyState }) {
  const ws = { send, readyState };
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
      <div className="main-div">
        <div className="chat-div">
          <ChatDisplay messages={messages} />
          <MessageTextBox onEnter={sendMessage} />
        </div>
        <StartGameButton ws={ws} />
      </div>
    </>
  );
}
