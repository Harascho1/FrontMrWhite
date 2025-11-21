import { Activity, useEffect } from "react";
import { useState } from "react";
import "./JoinRoomButton.css";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useRef } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function JoinRoomButton({ className }) {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={className}>
        <button onClick={handleClick}>Join Room</button>
      </div>
      <Activity mode={open ? "visible" : "hidden"}>
        <EnrollCart open={open} onClose={onClose} />
      </Activity>
    </>
  );
}

function EnrollCart({ open, onClose }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const [enrollKey, setEnrollKey] = useState("");
  const navigate = useNavigate();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        // TODO: Mozda da pozovem: onClose()
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const requestJoin = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.post(
        "/joinRoom",
        {
          enrollKey: enrollKey,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res.data.key);
      navigate(`/lobby/${res.data.url}`);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    requestJoin();
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      <Activity mode={open ? "visible" : "hidden"}>
        <motion.div
          className="overlay"
          ref={overlayRef}
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="cart"
            ref={dialogRef}
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", shiftness: 260, damping: 20 }}
            exit={{ opacity: 0 }}
          >
            <form className="cart-form" onSubmit={handleSubmit}>
              <label htmlFor="username">Type Room Key</label>
              <input
                id="username"
                value={enrollKey}
                onChange={(e) => setEnrollKey(e.target.value)}
                autoComplete="off"
                minLength={6}
                maxLength={6}
                required
              />
              <div className="cart-action">
                <button type="submit" className="btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </Activity>
    </AnimatePresence>,
    document.body,
  );
}
