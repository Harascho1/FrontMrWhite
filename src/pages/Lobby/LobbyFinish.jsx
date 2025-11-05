export default function LobbyFinished({ lobbyStatus, countdown }) {
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
      <h1 style={{ textAlign: "center" }}>Game finished</h1>
      {countdown.countdown !== 0 && (
        <h1 style={{ textAlign: "center" }}>
          {countdown.text + ": " + countdown.countdown}
        </h1>
      )}
      <h1>Impostor was: {lobbyStatus.impostor}</h1>
      {gameResult()}
    </>
  );
}
