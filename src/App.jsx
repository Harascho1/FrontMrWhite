import Home from "./pages/Home/Home.jsx";
import Lobby from "./pages/Lobby/Lobby.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import { useRefreshToken } from "./hooks/useRefreshToken.js";

function App() {
  useRefreshToken();
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/lobby/:lobbyId" element={<Lobby />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function NotFound() {
  return <h1 style={{ textAlign: "center" }}>Error 404</h1>;
}

export default App;
