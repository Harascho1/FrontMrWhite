import { useState } from "react";
import "./Chat.css";

export function MessageTextBox({ onEnter }) {
  const [value, setValue] = useState("");

  const handleChanges = (event) => {
    setValue(event.target.value);
  };

  const handleSend = () => {
    if (value.trim() !== "") {
      onEnter(value);
      setValue("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={value}
        onChange={handleChanges}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export function ChatDisplay({ messages }) {
  return (
    <div className="chat-display">
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Chat({ onEnter, messages, width, height }) {
  return (
    <>
      <div className="chat" style={{ width: width, height: height }}>
        <ChatDisplay messages={messages} />
        <MessageTextBox onEnter={onEnter} />
      </div>
    </>
  );
}
