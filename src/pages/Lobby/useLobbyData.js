import { useCallback, useEffect, useState } from "react";
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
  const { send, readyState, lastMessage } = useWebSocket(
    `ws://localhost:8080/api/v1/gameroom/ws`,
  );
  const [lobbyStatus, setLobbyStatus] = useState({
    action: "lobby_status",
    state: "waiting",
    players: [],
    votingList: [],
    playersWhoVote: [],
    gameStatus: "not_started",
    gameRound: 0,
    wordChain: [],
    turnIndex: 0,
    word: "",
    userId: 0,
    votedFor: "",
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
              state: data.state,
              players: data.players,
              gameStatus: data.gameStatus,
              wordChain: data.wordChain,
              word: data.word,
              turnIndex: data.turnIndex,
              gameRound: data.gameRound,
              userId: data.userId,
              votingList: data.votingList,
              playersWhoVote: data.playersWhoVote,
            }));
            break;
          }
          case "type": {
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
            }));
            break;
          }
          case "vote_list": {
            setLobbyStatus((prevStatus) => ({
              ...prevStatus,
              votingList: data.votingList,
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

  const onCloseAlert = useCallback(() => {
    setAlertOpen({
      flag: false,
      msg: "",
    });
  }, []);

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
    isAlertOpen,
    onCloseAlert,
  };
}
