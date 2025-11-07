import "./PlayerAvater.css";

const colors = [];

const PlayerAvatar = ({ name, style, isWritter, isMe }) => {
  const initials = name.charAt(0).toUpperCase();

  return (
    <>
      <div
        className={`player-avatar ${isMe ? "me" : ""} ${isWritter ? "writter" : ""}`}
        tabIndex="0"
        style={style}
      >
        <span className="avatar-initial">{initials}</span>
        <span className="avatar-full-name">{name}</span>
      </div>
    </>
  );
};

export default PlayerAvatar;
