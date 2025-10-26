import VoteButton from "../../components/VoteButton/VoteButton.jsx";

export default function LobbyVoting({
  lobbyStatus,
  send,
  readyState,
  countdown,
}) {
  const ws = { send, readyState };
  const players = lobbyStatus.votingList;
  const gridSize = Math.ceil(Math.sqrt(players.length));
  const totalCells = gridSize * gridSize;
  const cells = players.slice(0, totalCells);

  const myID = lobbyStatus.userId;
  const voters = lobbyStatus.playersWhoVote || [];
  const didIVote = voters.find((obj) => obj.id === myID);
  const hasVoted = !!didIVote;
  console.log(didIVote);

  while (cells.length < totalCells) {
    cells.push({ id: `empty-${cells.length}`, empty: true });
  }

  const renderYouVoted = () => {
    return <h1 style={{ textAlign: "center" }}> You locked in your vote</h1>;
  };

  const printCells = () => {
    return (
      <div
        className="player-grid-container"
        style={{ "--grid-size": gridSize }}
      >
        {cells.map((player) => (
          <div key={player.id} className="player-cell">
            {!player.empty && (
              <VoteButton
                ws={ws}
                player={player}
                btnClassName={`player-button ${didIVote ? "disabled" : ""}`}
                dissable={hasVoted}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Voting time</h1>
      {countdown.countdown !== 0 && (
        <h1 style={{ textAlign: "center" }}>
          {countdown.text + ": " + countdown.countdown}
        </h1>
      )}
      {printCells()}
      {hasVoted && renderYouVoted()}
    </>
  );
}
