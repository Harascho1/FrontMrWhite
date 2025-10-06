export default function VoteButton({ ws, player, btnClassName }) {
  const key = window.location.pathname.split("/lobby/")[1];
  const token = localStorage.getItem("token");
  // Need to add alert window
  const handleVotePlayer = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }
    ws.send(
      JSON.stringify({
        action: "send_vote",
        key: key,
        token: token,
        msg: String(player.id),
      }),
    );
  };
  return (
    <button className={btnClassName} onClick={handleVotePlayer}>
      {player.name}
    </button>
  );
}
