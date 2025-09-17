import React from "react";

export default function ChatDisplay({ messages }) {
  return (
    <div className="chat-box">
      <h3>Chat:</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
