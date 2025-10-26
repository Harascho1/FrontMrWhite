import { useRef } from "react";

export default function VoteButton({ ws, player, btnClassName, disabled }) {
  const lastTapTimeRef = useRef(0);

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

  const handleTouchEnd = (event) => {
    event.preventDefault();
    const currentTime = new Date().getTime();
    const tapTimeDelta = currentTime - lastTapTimeRef.current;

    if (tapTimeDelta > 0 && tapTimeDelta < 300) {
      console.log("Double click");
      handleVotePlayer(event);
      lastTapTimeRef.current = 0;
    } else {
      lastTapTimeRef.current = currentTime;
    }
  };

  return (
    <button
      className={btnClassName}
      onDoubleClick={handleVotePlayer}
      onTouchEnd={handleTouchEnd}
      disabled={disabled}
    >
      {player.name}
    </button>
  );
}
