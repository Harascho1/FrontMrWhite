import PopOutUsernameDemo from "../../components/UsernameModal/UsernameModal.jsx";
import CreateRoomButton from "../../components/CreateRoomButton/CreateRoomButton.jsx";
import "./Home.css";
import Arrow3 from "../../assets/pppointed (1).svg?react";
import Arrow2 from "../../assets/pppointed (2).svg?react";
import Arrow1 from "../../assets/pppointed (3).svg?react";
import Arrow4 from "../../assets/pppointed (4).svg?react";
import SArrow1 from "../../assets/strait.svg";
import SArrow2 from "../../assets/strait (2).svg";

export default function Home() {
  return (
    <>
      <div className="home-container">
        <h1>Mr. White</h1>
        <PopOutUsernameDemo />
      </div>
      <div className="home-container-button">
        <CreateRoomButton />
        <div className="arrow-container">
          <img src={Arrow1} className="arrow arrow-1" />
          <img src={Arrow2} className="arrow arrow-2" />
          <img src={Arrow3} className="arrow arrow-3" />
          <img src={Arrow4} className="arrow arrow-4" />
        </div>
      </div>
    </>
  );
}
