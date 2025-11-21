import { useCallback, useEffect, useMemo, useState } from "react";
import { useWebSocket } from "./useWebSocket.js";

export function useLobbyData() {
  const [messages, setMessages] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [countdown, setCountdown] = useState({
    countdown: 0,
    waitingFor: "",
  });
  const [isAlertOpen, setAlertOpen] = useState({
    flag: false,
    msg: "",
  });
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host =
    window.location.host === "localhost:5173"
      ? "localhost:8080"
      : window.location.host;

  const [lobbyStatus, setLobbyStatus] = useState({
    action: "lobby_status",
    state: "waiting",
    enroll: "",
    players: [],
    playersWhoVote: [],
    gameStatus: "not_started",
    gameRound: 0,
    wordChain: [],
    turnIndex: 0,
    word: "",
    userId: 0,
    votedFor: "",
    impostor: "",
  });

  const [timer, setTimer] = useState(0);

  const [privateMessages, setPrivateMessages] = useState({
    leftMessages: [],
    rightMessages: [],
  });

  useEffect(() => {
    function handleTokenChange() {
      window.location.reload();
    }
    window.addEventListener("tokenReady", handleTokenChange);
    return () => window.removeEventListener("tokenReady", handleTokenChange);
  }, []);

  const handleMessages = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.error) {
        console.error(data.error);
        setIsValid(false);
        return;
      }
      //TODO: Good for debugg
      //console.log(data);
      switch (data.action) {
        case "game_status": {
          setLobbyStatus((prevStatus) => ({
            ...prevStatus,
            gameStatus: data.gameStatus,
          }));
          break;
        }
        case "private_left_message": {
          setPrivateMessages((prevMessages) => ({
            ...prevMessages,
            leftMessages: data.msg,
          }));
          break;
        }
        case "private_right_message": {
          setPrivateMessages((prevMessages) => ({
            ...prevMessages,
            rightMessages: data.msg,
          }));
          break;
        }
        case "game_error": {
          setAlertOpen((prevAlert) => ({
            ...prevAlert,
            flag: true,
            msg: data.msg,
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
          setCountdown((prevStatus) => ({
            ...prevStatus,
            countdown: data.countdown,
            text: data.text,
          }));

          break;
        }
        case "players_who_vote": {
          setLobbyStatus((prevStatus) => ({
            ...prevStatus,
            playersWhoVote: data.playersWhoVote,
          }));
          break;
        }
        case "full_lobby_status": {
          setLobbyStatus((prevStatus) => ({
            ...prevStatus,
            enroll: data.enroll,
            state: data.state,
            players: data.players,
            gameStatus: data.gameStatus,
            wordChain: data.wordChain,
            word: data.word,
            turnIndex: data.turnIndex,
            gameRound: data.gameRound,
            userId: data.userId,
            playersWhoVote: data.playersWhoVote,
          }));
          break;
        }
        case "type": {
          setTimer(data.time);
          setLobbyStatus((prevStatus) => ({
            ...prevStatus,
            wordChain: data.wordChain,
            word: data.word,
            turnIndex: data.player_id,
          }));
          break;
        }
        case "lobby_game_status": {
          setLobbyStatus((prevStatus) => ({
            ...prevStatus,
            gameStatus: data.gameStatus,
            state: data.state,
            players: data.players,
            impostor: data.impostor,
            playersWhoVote: [],
          }));
          if (data.gameStatus !== "playing") {
            setPrivateMessages({
              leftMessages: [],
              rightMessages: [],
            });
          }
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
  }, []);
  const { send, readyState } = useWebSocket(
    `${protocol}//${host}/api/v1/gameroom/ws`,
    handleMessages,
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

  const sendMessage = useCallback(
    (messageText) => {
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
    },
    [send],
  );

  const onCloseAlert = useCallback(() => {
    setAlertOpen({
      flag: false,
      msg: "",
    });
  }, []);

  const sendWord = useCallback(
    (word) => {
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
    },
    [send],
  );

  const calculatedPlayers = useMemo(() => {
    let leftPlayer = null;
    let rightPlayer = null;
    if (lobbyStatus.state === "playing") {
      const myID = lobbyStatus.userId;
      const players = lobbyStatus.players.filter(
        (player) => player.status === "active",
      );
      const myIndex = players.findIndex((player) => player.id === myID);

      if (myIndex === -1) {
        console.error("findIndex did not find");
      }
      const arrLen = players.length;

      let leftIndex = (myIndex + 1 + arrLen) % arrLen;
      while (true) {
        leftPlayer = players[leftIndex];
        if (leftPlayer.status === "active") {
          break;
        }
        leftIndex++;
        leftIndex %= arrLen;
      }
      let rightIndex = (myIndex - 1 + arrLen) % arrLen;
      while (true) {
        rightPlayer = players[rightIndex];
        if (rightPlayer.status === "active") {
          break;
        }
        rightIndex--;
        rightIndex %= arrLen;
      }
    }
    return { leftPlayer, rightPlayer };
  }, [lobbyStatus.state, lobbyStatus.userId, lobbyStatus.players]);

  const { leftPlayer, rightPlayer } = calculatedPlayers;

  const sendLeftPlayer = useCallback(
    (text) => {
      if (!leftPlayer) return;
      send(
        JSON.stringify({
          action: "send_left",
          toUser: leftPlayer.id,
          fromUser: lobbyStatus.userId,
          msg: text,
        }),
      );
    },
    [send, leftPlayer, lobbyStatus.userId],
  );

  const sendRightPlayer = useCallback(
    (text) => {
      if (!rightPlayer) return;
      send(
        JSON.stringify({
          action: "send_right",
          toUser: rightPlayer.id,
          fromUser: lobbyStatus.userId,
          msg: text,
        }),
      );
    },
    [send, rightPlayer, lobbyStatus.userId],
  );

  return {
    isValid,
    sendMessage,
    sendWord,
    messages,
    send,
    readyState,
    lobbyStatus,
    countdown,
    isAlertOpen,
    onCloseAlert,
    // NOTE: Noovooo
    sendLeftPlayer,
    sendRightPlayer,
    // NOTE:
    privateMessages,
    timer,
  };
}
