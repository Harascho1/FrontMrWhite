import { useState } from "react";
import { useNavigate } from "react-router-dom";

const createRoom = async (token, navigate) => {
  await fetch("http://localhost:8080/api/v1/createRoom", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => navigate(`lobby/${data.token}`))
    .catch((err) => console.error(err));
};

export default function CreateRoomButton() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleButtonClick = (e) => {
    if (e) {
      e.preventDefault();
    }

    const token = localStorage.getItem("token");
    if (token.length === 0 || token === null) {
      setError("token doesn't exist");
      console.error(error);
    }
    createRoom(token, navigate);
  };

  return (
    <>
      <button onClick={handleButtonClick}>Create Room</button>
    </>
  );
}
