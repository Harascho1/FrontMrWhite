import Home from "./pages/Home/Home.jsx";
import Lobby from "./pages/Lobby/Lobby.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import Layout from "./components/Layout/Layout.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/lobby/:lobbyId" element={<Lobby />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

function NotFound() {
  return <h1 style={{ textAlign: "center" }}>Error 404</h1>;
}

export default App;
