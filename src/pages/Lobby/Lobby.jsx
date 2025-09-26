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
  const [messages, setMessages] = useState([]);
  const [countdown, setCountdown] = useState(10);
  const [isValid, setIsValid] = useState(true);
  const { send, readyState, lastMessage } = useWebSocket(
    `ws://localhost:8080/api/v1/gameroom/ws`,
  );
  const [lobbyStatus, setLobbyStatus] = useState({
    action: "lobby_status",
    state: "waiting",
    players: [],
    gameStatus: "not_started",
    gameRound: 0,
    wordChain: [],
    turnIndex: 0,
    word: "",
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
        switch (data.action) {
          case "lobby_status": {
            console.log(data);
            setLobbyStatus({
              state: data.state,
              players: data.players,
              gameStatus: data.gameStatus,
              wordChain: data.wordChain,
              word: data.word,
              turnIndex: data.turnIndex,
              gameRound: data.gameRound,
            });
            console.log(lobbyStatus);
            break;
          }
          case "player_list": {
            console.log(data);
            setLobbyStatus((prevStatus) => ({
              ...prevStatus,
              players: data.players,
            }));
            break;
          }
          case "chat_message": {
            setMessages((prevMessages) => {
              const updatedMsgs = [...prevMessages, data.msg];
              return updatedMsgs;
            });
            break;
          }
        }
      } catch (err) {
        console.error("Failed to parse message:", err);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (lobbyStatus.state === "counting" && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => setCountdown(prevCountdown - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
    if (countdown === 0) {
      //Mogao bih ovde da obavestim i back-end
      //send(
      //  JSON.stringify({
      //    action: "game_start",
      //    key: key,
      //    token: token,
      //    msg: messageText,
      //  }),
      //);
    }
  }, [lobbyStatus.state, countdown]);

  const sendMessage = (messageText) => {
    const key = window.location.pathname.split("/lobby/")[1];
    const token = localStorage.getItem("token");
    send();
  };

  return {
    isValid,
    sendMessage,
    messages,
    send,
    readyState,
    lobbyStatus,
    countdown,
  };
}

export default function Lobby() {
  const {
    isValid,
    sendMessage,
    messages,
    send,
    readyState,
    lobbyStatus,
    countdown,
  } = useLobbyPlayers();

  if (!isValid) {
    return <InvalidLobby />;
  }
  return (
    <ValidLobby
      send={send}
      readyState={readyState}
      sendMessage={sendMessage}
      messages={messages}
      lobbyStatus={lobbyStatus}
      countdown={countdown}
    />
  );
}

function InvalidLobby() {
  return <h1 style={{ textAlign: "center" }}>Invalid Invation Link</h1>;
}

function ValidLobby({
  messages,
  sendMessage,
  send,
  readyState,
  lobbyStatus,
  countdown,
}) {
  const ws = { send, readyState };

  const render = () => {
    switch (lobbyStatus.state) {
      case "waiting":
        return (
          <>
            <h1 style={{ textAlign: "center" }}>You are in lobby</h1>
            <UserProfile />
            <div className="main-div">
              <StartGameButton ws={ws} />
            </div>
            <div className="players-box">
              <h2>Players:</h2>
              <ul>
                {lobbyStatus.players.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            </div>
          </>
        );
      case "counting":
        return (
          <>
            <h1 style={{ textAlign: "center" }}>Game start in {countdown}</h1>
            <div className="players-box">
              <h2>Players:</h2>
              <ul>
                {lobbyStatus.players.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            </div>
          </>
        );
      case "in_progrese":
        return (
          <>
            <h1 style={{ textAlign: "center" }}>Game started</h1>
            <div className="main-div">
              <div className="chat-div">
                <ChatDisplay messages={messages} />
                <MessageTextBox onEnter={sendMessage} />
              </div>
            </div>
          </>
        );
    }
  };

  return render();
}
