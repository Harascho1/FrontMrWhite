import PopOutUsernameDemo from "../../components/UsernameModal/UsernameModal.jsx";
import CreateRoomButton from "../../components/CreateRoomButton/CreateRoomButton.jsx";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <h1>Mr. White</h1>
      <div className="home-container-buttons">
        <PopOutUsernameDemo />
        <CreateRoomButton />
      </div>
    </div>
  );
}
