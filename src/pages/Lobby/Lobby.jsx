import { useLobbyData } from "./useLobbyData.js";
import AlertWindow from "../../components/AlertWindow/AlertWindow";
import LobbyWaiting from "./LobbyWaiting.jsx";
import LobbyFinished from "./LobbyFinish.jsx";
import LobbyPlaying from "./LobbyPlaying.jsx";
import LobbyVoting from "./LobbyVoting.jsx";
import "./Lobby.css";

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
    isAlertOpen,
    onCloseAlert,
    sendLeftPlayer,
    sendRightPlayer,
    privateMessages,
    timer,
  } = useLobbyData();

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
      alert={isAlertOpen}
      onCloseAlert={onCloseAlert}
      sendLeftPlayer={sendLeftPlayer}
      sendRightPlayer={sendRightPlayer}
      privateMessages={privateMessages}
      timer={timer}
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
  alert,
  onCloseAlert,
  sendLeftPlayer,
  sendRightPlayer,
  privateMessages,
  timer,
}) {
  const renderLobbyContent = () => {
    switch (lobbyStatus.state) {
      case "waiting":
        return (
          <LobbyWaiting
            lobbyStatus={lobbyStatus}
            sendMessage={sendMessage}
            messages={messages}
            send={send}
            readyState={readyState}
          />
        );
      case "playing":
        if (lobbyStatus.gameStatus === "playing")
          return (
            <LobbyPlaying
              lobbyStatus={lobbyStatus}
              countdown={countdown}
              sendWord={sendWord}
              sendLeftPlayer={sendLeftPlayer}
              sendRightPlayer={sendRightPlayer}
              privateMessages={privateMessages}
              timer={timer}
            />
          );
        else if (lobbyStatus.gameStatus === "voting")
          return (
            <LobbyVoting
              lobbyStatus={lobbyStatus}
              send={send}
              readyState={readyState}
              countdown={countdown}
            />
          );
        break;
      case "finished":
        return (
          <LobbyFinished lobbyStatus={lobbyStatus} countdown={countdown} />
        );
      default:
    }
  };
  return (
    <>
      <AlertWindow
        isOpen={alert.flag}
        text={alert.msg}
        onClose={onCloseAlert}
      />
      {renderLobbyContent()}
    </>
  );
}
