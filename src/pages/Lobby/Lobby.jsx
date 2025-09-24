import { useEffect, useRef, useState } from "react";
import { UserProfile } from "../../components/UserProfile/UserProfile";
import StartGameButton from "../../components/StartGameButton/StartGameButton";
import MessageTextBox from "../../components/MessageTextBox/MessageTextBox";
import ChatDisplay from "../../components/ChatDisplay/ChatDisplay";
import "./Lobby.css";

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
  const [countdown, setCountdown] = useState(10);
  const { send, readyState, lastMessage } = useWebSocket(
    `ws://localhost:8080/api/v1/gameroom/ws`,
  );
  const [lobbyStatus, setLobbyStatus] = useState({
    state: "waiting",
    players: [],
    gameStatus: "not_started",
    gameRound: 0,
    wordChain: [],
    turnIndex: 0,
  });

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
        if (data.action === "lobby-status") {
          setLobbyStatus(data);
        } else if (data.action === "player_list") {
          setPlayers(data.players);
        } else if (data.action === "game_status") {
          setGameStatus("counting");
          setRole(data.role);
          setWord(data.word);
        } else if (data.action === "chat_message") {
          setMessages((prevMessages) => {
            const updatedMsgs = [...prevMessages, data.msg];
            return updatedMsgs;
          });
        }
      } catch (err) {
        console.error("Failed to parse message:", err);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (gameStatus === "counting" && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => setCountdown(prevCountdown - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
    if (countdown === 0) {
      //Mogao bih ovde da obavestim i back-end
      setGameStatus("in-progress");
    }
  }, [gameStatus, countdown]);

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

  return {
    players,
    isValid,
    sendMessage,
    messages,
    send,
    readyState,
    gameStatus,
    countdown,
    role,
    word,
  };
}

export default function Lobby() {
  const {
    players,
    isValid,
    sendMessage,
    messages,
    send,
    readyState,
    gameStatus,
    countdown,
    role,
    word,
  } = useLobbyPlayers();

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
      gameStatus={gameStatus}
      countdown={countdown}
      role={role}
      word={word}
    />
  );
}

function InvalidLobby() {
  return <h1 style={{ textAlign: "center" }}>Invalid Invation Link</h1>;
}

function ValidLobby({
  players,
  messages,
  sendMessage,
  send,
  readyState,
  gameStatus,
  countdown,
  role,
  word,
}) {
  const ws = { send, readyState };

  const render = () => {
    switch (gameStatus) {
      case "waiting":
        return (
          <>
            <h1 style={{ textAlign: "center" }}>You are in lobby</h1>
            <UserProfile />
            <div className="players-box">
              <h2>Players:</h2>
              <ul>
                {players &&
                  players.map((name, idx) => <li key={idx}>{name}</li>)}
              </ul>
            </div>
          </>
        );
      case "counting":
        return (
          <>
            <h1 style={{ textAlign: "center" }}>Game start in {countdown}</h1>
            <p style={{ textAlign: "center" }}>
              Your role is {role} and word is {word}
            </p>
          </>
        );
      case "in_progrese":
        return (
          <>
            <h1 style={{ textAlign: "center" }}>Game started</h1>
            <p style={{ textAlign: "center" }}>
              Your role is {role} and word is {word}
            </p>
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
  };

  return render();
}
