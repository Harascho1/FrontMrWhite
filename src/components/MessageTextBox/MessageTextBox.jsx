import { useState } from "react";
import "./MessageTextBox.css";

export default function MessageTextBox({ onEnter, disabled }) {
  const [value, setValue] = useState("");

  const handleChanges = (event) => {
    setValue(event.target.value);
  };

  const handleSend = () => {
    if (value.trim() !== "" && !disabled) {
      onEnter(value);
      setValue(""); // Cistimo input polje
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
        disabled={disabled}
        placeholder={disabled ? "Wait for your turn to chat" : "Type your message..."}
        className={disabled ? "disabled" : ""}
      />
    </div>
  );
}
