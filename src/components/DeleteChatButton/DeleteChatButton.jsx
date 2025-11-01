import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertWindow from "../AlertWindow/AlertWindow";
import api from "../../services/api";

const createRoom = async (token, navigate) => {
  try {
    const response = await api.get(`/createRoom`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await navigate(`lobby/${response.data.token}`);
  } catch (err) {
    console.error(err);
  }
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
