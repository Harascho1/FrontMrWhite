import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { AnimatePresence, motion } from "framer-motion";
import "./UsernameModal.css";

export default function UsernameModal({ open, onClose }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const firstFocusable = useRef(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Have to error check this func

    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    const result = await login(username);
    if (result == true) {
      onClose();
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        //onClose();
      }
      if (e.key === "Tab") {
        const focusables = getFocusableElements(dialogRef.current);
        if (focusables.length === 0) {
          //setOpen(false);
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && active === last) {
          first.focus();
          e.preventDefault();
        }
      }
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstFocusable.current?.focus(), 0);
    }
  }, [open]);

  // const onOverlayClick = (e) => {
  //   if (e.target === overlayRef.current) {
  //   }
  // };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="overlay"
          ref={overlayRef}
          //onMouseDown={onOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="username-title"
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", shiftness: 260, damping: 20 }}
          >
            <form className="modal-form" onSubmit={handleSubmit}>
              <label htmlFor="username">Type your username</label>
              <input
                id="username"
                ref={firstFocusable}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                minLength={3}
                required
              />

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function getFocusableElements(container) {
  if (!container) {
    return null;
  }

  const selectors = [
    "a[href]",
    "button:not([disable])",
    "textarea:not([disable])",
    "input:not([disable])",
    "select:not([disable])",
    '[tabindex]:not([tabindex="-1"])',
  ];
  const nodes = Array.from(container.querySelectorAll(selectors.join(",")));
  return nodes.filter(
    (el) => !el.hasAttribute("disable") && !el.getAttribute("aria-hidden"),
  );
}

const login = async (username) => {
  if (!username) {
  }

  try {
    const res = await api.post("login", {
      username: username,
    });
    localStorage.setItem("token", res.data.token);
    return true;
  } catch (err) {
    console.error("Error: ", err);
    return false;
  }
};
