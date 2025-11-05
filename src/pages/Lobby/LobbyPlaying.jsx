import ChatDisplay from "../../components/ChatDisplay/ChatDisplay";
import MessageTextBox from "../../components/MessageTextBox/MessageTextBox";
import Table from "../../assets/sto12.svg";
import Chat from "../../components/Chat/Chat";
import ChatIcon from "../../assets/chat.svg";
import { useMemo, useState } from "react";
import TimeBar from "../../components/TimeBar/TimeBar";

export default function LobbyPlaying({
  lobbyStatus,
  countdown,
  sendWord,
  sendDM,
  privateMessages,
  timer,
}) {
  // NOTE: Ovo moze da pozluzi mozda posle.!.
  /*
  const renderPlayersBox = () => {
    return (
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
    );
  };
  */
  let writter = null;
  if (lobbyStatus.turnIndex !== 0) {
    writter = lobbyStatus.players.find(
      (obj) => obj.id === lobbyStatus.turnIndex,
    );
  }

  const players = lobbyStatus.players;
  const renderPlayersOnTable = () => {
    const activePlayers = players.filter(
      (player) => player.status === "active",
    );
    const playersCount = activePlayers.length;

    const radiusX = 45;
    const radiusY = 45;
    const centerX = 50;
    const centerY = 50;

    return (
      <>
        <div className="players-position">
          {activePlayers.map((player, index) => {
            const angle = (index / playersCount) * 2 * Math.PI - Math.PI / 2;

            const x = centerX + radiusX * Math.cos(angle);
            const y = centerY + radiusY * Math.sin(angle);

            const playerStyle = {
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
            };

            const isMe = player.id === lobbyStatus.userId;

            let isWritter = false;
            if (writter != null) {
              isWritter = player.id === writter.id;
            }

            return (
              <div
                key={player.id}
                className={`player-circle ${isMe ? "me" : ""} ${isWritter ? "writer" : ""}`}
                style={playerStyle}
              >
                {player.name.substring(0, 1)}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const [lopen, setLOpen] = useState(false);
  const [ropen, setROpen] = useState(false);

  const myID = lobbyStatus.userId;
  const kickedPlayers = players.filter((player) => player.status == "kicked");
  const hasKicked = !!kickedPlayers.find((obj) => obj.id === myID);
  return (
    <>
      {countdown.countdown !== 0 && (
        <h1 style={{ textAlign: "center" }}>
          {countdown.text + ": " + countdown.countdown}
        </h1>
      )}
      {countdown.countdown === 0 && lobbyStatus.turnIndex !== 0 && (
        <h1 style={{ textAlign: "center" }}>{writter.name} turn</h1>
      )}
      <div className="lobby-container">
        <div className={`left-chat-toggle`} onClick={() => setLOpen(!lopen)}>
          <button>
            <img src={ChatIcon} style={{ width: "35px" }} />
          </button>
        </div>
        <div className={`left-chat ${lopen ? "lactive" : ""}`}>
          <Chat
            disabled={hasKicked}
            messages={privateMessages.leftMessages}
            onEnter={sendDM.sendLeftPlayer}
            width={`${lopen ? "70vw" : "20vw"}`}
            height={`${lopen ? "50vh" : "40%"}`}
          />
        </div>
        <div className="main-div">
          <div className="chat-div-playing">
            <img src={Table} className="table-container" />
            <TimeBar key={`${timer}-${lobbyStatus.turnIndex}-${lobbyStatus.wordChain.length}`} timeInMS={timer} />
            {renderPlayersOnTable()}
          </div>
          <div className="chat-stack">
            <h2 style={{ textAlign: "center" }}>Word is {lobbyStatus.word}</h2>
            <ChatDisplay messages={lobbyStatus.wordChain} />
            <MessageTextBox
              onEnter={sendWord}
              disabled={lobbyStatus.userId !== lobbyStatus.turnIndex}
            />
          </div>
        </div>
        <div className="right-chat-toggle" onClick={() => setROpen(!ropen)}>
          <button>
            <img src={ChatIcon} style={{ width: "35px" }} />
          </button>
        </div>
        {ropen && (
          <div
            className="playing-overlay"
            onClick={() => setROpen(false)}
          ></div>
        )}
        {lopen && (
          <div
            className="playing-overlay"
            onClick={() => setLOpen(false)}
          ></div>
        )}
        <div className={`right-chat ${ropen ? "ractive" : ""}`}>
          <Chat
            disabled={hasKicked}
            messages={privateMessages.rightMessages}
            onEnter={sendDM.sendRightPlayer}
            width={`${ropen ? "70vw" : "20vw"}`}
            height={`${ropen ? "50vh" : "40%"}`}
          />
        </div>
      </div>
    </>
  );
}
