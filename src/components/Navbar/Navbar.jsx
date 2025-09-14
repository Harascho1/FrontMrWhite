import { Link } from "react-router-dom";
import "./Navbar.css";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="navbar-container">
      <div className="menu-toggle" onClick={() => setOpen(!open)}>
        ☰
      </div>
      {open && <div className="backdrop" onClick={() => setOpen(false)}></div>}
      <div className={`nav-links ${open ? "active" : ""}`}>
        <Link to="/">
          <button>Home</button>
        </Link>
        <Link to="/rules">
          <button>Rules</button>
        </Link>
        <Link to="/games">
          <button>Games</button>
        </Link>
      </div>
    </div>
  );
}
