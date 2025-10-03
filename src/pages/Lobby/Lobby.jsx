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
  const [countdown, setCountdown] = useState(0);
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
          case "countdown": {
            setCountdown(data.countdown);
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
          case "game_finished": {
            setLobbyStatus((prevStatus) => ({
              ...prevStatus,
              gameStatus: data.gameStatus,
              state: data.state,
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

  const sendWord = (word) => {
    const key = window.location.pathname.split("/lobby/")[1];
    const token = localStorage.getItem("token");
    send(
      JSON.stringify({
        action: "send_word",
        key: key,
        token: token,
        msg: word.split(" ")[0],
      }),
    );
  };

  return {
    isValid,
    sendMessage,
    sendWord,
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
    sendWord,
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
      sendWord={sendWord}
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
  sendWord,
  send,
  readyState,
  lobbyStatus,
  countdown,
}) {
  const ws = { send, readyState };

  const render = () => {
    switch (lobbyStatus.state) {
      case "waiting":
        // TODO: MYb to add whos lobby is / eg. Luka's lobby
        return (
          <div className="lobby-container">
            <div className="players-box">
              <h2>Players:</h2>
              <ul>
                {lobbyStatus.players.map((player) => {
                  const isMe = player.id === lobbyStatus.userId;
                  const playerStype = { fontWeight: isMe ? "bold" : "normal" };
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
                <ChatDisplay messages={messages} />
                <MessageTextBox onEnter={sendMessage} />
              </div>
              <div className="start-game-btn">
                <StartGameButton ws={ws} />
              </div>
            </div>
            <UserProfile />
          </div>
        );
      case "playing":
        if (lobbyStatus.gameStatus === "playing") {
          return (
            <>
              {countdown !== 0 && (
                <h1 style={{ textAlign: "center" }}>
                  Game start in {countdown}
                </h1>
              )}
              <div className="lobby-container">
                <div className="players-box">
                  <h2>Players:</h2>
                  <ul>
                    {lobbyStatus.players.map((player) => {
                      const isMe = player.id === lobbyStatus.userId;
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
                      <MessageTextBox onEnter={sendWord} />
                    )}
                  </div>
                </div>
                <UserProfile />
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
        const gameResult = () => {
          switch (lobbyStatus.gameStatus) {
            case "civ_win":
              return <h1 style={{ textAlign: "center" }}>Normies win</h1>;
            case "imp_win":
              return <h1 style={{ textAlign: "center" }}>Impostor wins</h1>;
            case "mr_white":
              return <h1 style={{ textAlign: "center" }}>Mr. White wins</h1>;
          }
        };
        return (
          <>
            <h1 style={{ textAlign: "center" }}>Game finish</h1>
            {gameResult()}
          </>
        );
      }
    }
  };

  return render();
}
