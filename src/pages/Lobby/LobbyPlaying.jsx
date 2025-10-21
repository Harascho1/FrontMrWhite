import ChatDisplay from "../../components/ChatDisplay/ChatDisplay";
import MessageTextBox from "../../components/MessageTextBox/MessageTextBox";

export default function LobbyPlaying({ lobbyStatus, countdown, sendWord }) {
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

  if (lobbyStatus.gameStatus === "playing") {
    let writter = null;
    console.log(lobbyStatus.turnIndex);
    if (lobbyStatus.turnIndex !== 0) {
      writter = lobbyStatus.players.find(
        (obj) => obj.id === lobbyStatus.turnIndex,
      );
    }
    console.log(writter);
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
          {renderPlayersBox()}
          <div className="main-div">
            <div className="chat-div">
              <p>Word is {lobbyStatus.word}</p>
              <ChatDisplay messages={lobbyStatus.wordChain} />
              {lobbyStatus.userId === lobbyStatus.turnIndex && (
                <MessageTextBox onEnter={sendWord} />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}
