import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertWindow from "../AlertWindow/AlertWindow";
import api from "../../services/api";
import { Activity } from "react";

const createRoom = async (token, navigate) => {
  try {
    const response = await api.get("/createRoom", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const roomKey = response.data.key;
    navigate(`lobby/${roomKey}`);
  } catch (err) {
    console.error(err);
  }
};

export default function CreateRoomButton({ className }) {
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
      {/* wrapper receives animated border styles via the passed className */}
      <div className={className}>
        <button onClick={handleButtonClick}>Create Room</button>
      </div>
      <Activity mode={isAlertOpen ? "visible" : "hiddne"}>
        <AlertWindow
          isOpen={isAlertOpen}
          onClose={handleCloseAlert}
          text={"You need to be logged on frist!"}
        />
      </Activity>
    </>
  );
}
