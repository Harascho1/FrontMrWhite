import { useEffect, useRef, useState } from "react";
import { UserProfile } from "../../components/UserProfile/UserProfile";
import StartGameButton from "../../components/StartGameButton/StartGameButton";
import MessageTextBox from "../../components/MessageTextBox/MessageTextBox";
import ChatDisplay from "../../components/ChatDisplay/ChatDisplay";
import "./Lobby.css";
import { useCallback } from "react";

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

  const send = useCallback(
    (data) => {
      if (ws && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(data);
      } else {
        console.error("WebSocket is not connected");
      }
    },
    [ws],
  );

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
    userId: 0,
    activeId: 0,
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
        console.log(data);
        switch (data.action) {
          case "game_status": {
            setLobbyStatus((prevStatus) => ({
              ...prevStatus,
              gameStatus: data.gameStatus,
            }));
            break;
          }
          case "lobby_status": {
            setLobbyStatus((prevStatus) => ({
              ...prevStatus,
              state: data.state,
            }));
            break;
          }
          case "full_lobby_status": {
            setLobbyStatus({
              state: data.state,
              players: data.players,
              gameStatus: data.gameStatus,
              wordChain: data.wordChain,
              word: data.word,
              turnIndex: data.turnIndex,
              gameRound: data.gameRound,
              userId: data.userId,
              activeId: data.activeId,
            });
            break;
          }
          case "type": {
            setLobbyStatus((prevStatus) => ({
              ...prevStatus,
              wordChain: data.word_chain,
              activeId: data.player_id,
            }));
            break;
          }
          case "word_entered": {
            setLobbyStatus((prevStatus) => ({
              ...prevStatus,
              wordChain: data.word_chain,
            }));
            break;
          }
          case "player_list": {
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
    if (lobbyStatus.state === "playing" && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => setCountdown(prevCountdown - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lobbyStatus.state, countdown]);

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
                {lobbyStatus.players.map((player) => {
                  console.log(player.id);
                  console.log(lobbyStatus.userId);
                  const isMe = player.id === lobbyStatus.userId;
                  console.log("isMe value:", isMe);
                  const playerStype = { fontWeight: isMe ? "bold" : "normal" };
                  return (
                    <li key={player.id} style={playerStype}>
                      {player.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        );
      case "playing":
        if (lobbyStatus.gameStatus === "playing") {
          return (
            <>
              <h1 style={{ textAlign: "center" }}>Game started</h1>
              {countdown !== 0 && (
                <h1 style={{ textAlign: "center" }}>
                  Game start in {countdown}
                </h1>
              )}
              <UserProfile />
              <div className="players-box">
                <h2>Players:</h2>
                <ul>
                  {lobbyStatus.players.map((player) => {
                    const isMe = player.id === lobbyStatus.userId;
                    console.log("isMe value:", isMe);
                    const playerStype = {
                      fontWeight: isMe ? "bold" : "normal",
                    };
                    return (
                      <li key={player.id} style={playerStype}>
                        {player.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="main-div">
                <div className="chat-div">
                  <p>Word is {lobbyStatus.word}</p>
                  <ChatDisplay messages={lobbyStatus.wordChain} />
                  {lobbyStatus.userId === lobbyStatus.activeId && (
                    <MessageTextBox onEnter={sendMessage} />
                  )}
                </div>
              </div>
            </>
          );
        } else if (lobbyStatus.gameStatus === "voting") {
          const players = lobbyStatus.players;
          console.log(players);
          const gridSize = Math.ceil(Math.sqrt(players.length));
          const totalCells = gridSize * gridSize;
          const cells = players.slice(0, totalCells);

          while (cells.lenght < totalCells) {
            cells.push({ id: `empty-${cells.lenght}`, empty: true });
          }
          return (
            <>
              <h1 style={{ textAlign: "center" }}>Voting time</h1>
              <div
                className="player-grid-container"
                style={{ "--grid-size": gridSize }}
              >
                {cells.map((player) => (
                  <div key={player.id} className="player-cell">
                    {!player.empty && (
                      <button
                        className="player-button"
                        onClick={() => alert(`Kliknut igrac ${player.name}`)}
                      >
                        {player.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          );
        }
      case "finished": {
        return <h1 style={{ textAlign: "center" }}>Game finishe</h1>;
      }
    }
  };

  return render();
}
