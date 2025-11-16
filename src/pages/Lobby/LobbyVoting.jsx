import VoteButton from "../../components/VoteButton/VoteButton.jsx";
import { useMemo } from "react";

export default function LobbyVoting({
  lobbyStatus,
  send,
  readyState,
  countdown,
}) {
  const wsWrapper = useMemo(
    () => ({
      send: send,
      readyState: readyState,
    }),
    [send, readyState],
  );

  const myID = lobbyStatus.userId;
  const players = lobbyStatus.players.filter(
    (player) => player.id !== myID && player.status !== "kicked",
  );
  const voters = lobbyStatus.playersWhoVote || [];
  const didIVote = voters.find((obj) => obj.id === myID);
  const hasVoted = !!didIVote;
  const wasIKicked = lobbyStatus.players.find(
    (obj) => obj.id === myID && obj.status === "kicked",
  );
  const hasKicked = !!wasIKicked;

  const playersDependency = JSON.stringify(players);
  const votersDependency = JSON.stringify(voters);

  const renderYouVoted = () => {
    return <h1 style={{ textAlign: "center" }}> You locked in your vote</h1>;
  };

  const printCells = useMemo(() => {
    const gridSize = Math.ceil(Math.sqrt(players.length));
    const totalCells = gridSize * gridSize;
    const cells = players.slice(0, totalCells);
    while (cells.length < totalCells) {
      cells.push({ id: `empty-${cells.length}`, empty: true });
    }

    return (
      <div
        className="player-grid-container"
        style={{ "--grid-size": gridSize }}
      >
        {cells.map((player) => (
          <div key={player.id} className="player-cell">
            {!player.empty && (
              <VoteButton
                ws={wsWrapper}
                player={player}
                btnClassName={`player-button ${didIVote ? "disabled" : ""}`}
                dissable={hasVoted}
              />
            )}
          </div>
        ))}
      </div>
    );
  }, [
    playersDependency,
    votersDependency,
    wsWrapper,
    myID,
    didIVote,
    hasVoted,
  ]);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Voting time</h1>
      {countdown.countdown !== 0 && (
        <h1 style={{ textAlign: "center" }}>
          {countdown.text + ": " + countdown.countdown}
        </h1>
      )}
      {!hasKicked && printCells}
      {hasVoted && renderYouVoted()}
    </>
  );
}
