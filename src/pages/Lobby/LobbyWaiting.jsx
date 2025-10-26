import StartGameButton from "../../components/StartGameButton/StartGameButton";
import { useState } from "react";
import UserIcon from "../../assets/user-svgrepo-com.svg";
import Chat from "../../components/Chat/Chat";

export default function LobbyWaiting({
  lobbyStatus,
  sendMessage,
  messages,
  send,
  readyState,
}) {
  const [open, setOpen] = useState(false);

  const ws = { send, readyState };
  const moreInforBox = () => {
    return (
      <div className="more-info-box">
        <p>
          The game includes a database of 100 words. Every time you play, the
          system randomly selects words from this collection, so the experience
          is always unique and unpredictable.
        </p>
        <p>
          If you’d like to contribute or suggest new words, please open an issue
          on GitHub — suggestions are always welcome!
        </p>
      </div>
    );
  };

  const motivationQuates = () => {
    return (
      <div className="more-info-box">
        <p>Every word is a new challenge — give it your best shot!</p>
      </div>
    );
  };

  const inspirationQuate = () => {
    return (
      <div className="more-info-box">
        <p>Because sometimes, the smallest games bring the biggest joy.</p>
      </div>
    );
  };

  const renderPlayersBox = () => {
    return (
      <>
        <div className="players-toggle" onClick={() => setOpen(!open)}>
          <button>
            <img src={UserIcon} style={{ width: "35px" }} />
          </button>
        </div>
        {open && (
          <div className="players-overlay" onClick={() => setOpen(false)}></div>
        )}
        <div className={`players-box ${open ? "active" : ""}`}>
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
      </>
    );
  };

  return (
    <>
      <div className="lobby-container">
        <div className="left-column">
          {renderPlayersBox()}
          {motivationQuates()}
        </div>
        <div className="main-div">
          <Chat onEnter={sendMessage} messages={messages} />
        </div>
        <div className="right-column">
          {moreInforBox()} {inspirationQuate()}
        </div>
      </div>
      <div className="start-game-btn">
        <StartGameButton ws={ws} />
      </div>
    </>
  );
}
