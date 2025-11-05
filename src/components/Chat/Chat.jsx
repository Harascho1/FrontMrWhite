import { useState, useRef, useEffect } from "react";
import "./Chat.css";

export function MessageTextBox({ onEnter, disable }) {
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
        disabled={disable}
      />
    </div>
  );
}

export function ChatDisplay({ messages, autoScroll }) {
  const chatContaininerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContaininerRef.current && autoScroll === true) {
      const { scrollHeight, clientHeight } = chatContaininerRef.current;
      chatContaininerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-display" ref={chatContaininerRef}>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Chat({
  onEnter,
  messages,
  width,
  height,
  autoScroll = false,
  disabled = false,
}) {
  return (
    <>
      <div className="chat" style={{ width: width, height: height }}>
        <ChatDisplay messages={messages} autoScroll={autoScroll} />
        <MessageTextBox onEnter={onEnter} disable={disabled} />
      </div>
    </>
  );
}
