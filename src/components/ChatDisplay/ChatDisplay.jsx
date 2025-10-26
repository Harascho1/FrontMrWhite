import React from "react";
import "./ChatDisplay.css";

export default function ChatDisplay({ messages }) {
  return (
    <div className="chat-box">
      <ul>
        {messages.map((msg, index) => (
          <li key={index} className="chat-line">
            {typeof msg === "string" ? (
              msg
            ) : (
              <>
                <span className="player-name">{msg.playerName}: </span>
                <span className="chat-text">{msg.text}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
