import { useState } from "react";
import "./MessageTextBox.css";

export default function MessageTextBox({ onEnter }) {
  const [value, setValue] = useState("");

  const handleChanges = (event) => {
    setValue(event.target.value);
  };

  const handleSend = () => {
    if (value.trim() !== "") {
      onEnter(value);
      setValue(""); // Cistimo input polje
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
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
