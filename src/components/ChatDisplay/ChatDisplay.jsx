import React from "react";
import "./ChatDisplay.css";

export default function ChatDisplay({ messages }) {
  return (
    <div className="chat-box">
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
