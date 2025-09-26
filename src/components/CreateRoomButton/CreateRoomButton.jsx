import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertWindow from "../AlertWindow/AlertWindow";

const createRoom = async (token, navigate) => {
  await fetch("http://localhost:8080/api/v1/createRoom", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => navigate(`lobby/${data.key}`))
    .catch((err) => console.error(err));
};

export default function CreateRoomButton() {
  const navigate = useNavigate();
  //const [isLoggedOn, setLoggedOn] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);

  const handleButtonClick = (e) => {
    if (e) {
      e.preventDefault();
    }
    const token = localStorage.getItem("token");
    if (!token) {
      //setLoggedOn(true);
      setAlertOpen(true);
      return;
    }
    createRoom(token, navigate);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  return (
    <>
      <button onClick={handleButtonClick}>Create Room</button>
      {isAlertOpen ? (
        <AlertWindow
          isOpen={isAlertOpen}
          onClose={handleCloseAlert}
          text={"You need to be logged on frist!"}
        />
      ) : null}
    </>
  );
}
