import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./UsernameModal.css";

function UsernameModal({ open, onClose, onSubmit, value, onChange, error }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const firstFocusable = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Tab") {
        const focusables = getFocusableElements(dialogRef.current);
        if (focusables.length === 0) {
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          last.focus();
          e.preventDefault;
        } else if (!e.shiftKey && active === last) {
          first.focus();
          e.preventDefault;
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

  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="overlay"
          ref={overlayRef}
          onMouseDown={onOverlayClick}
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
            <form className="modal-form" onSubmit={onSubmit}>
              <label htmlFor="username">Type your username</label>
              <input
                id="username"
                ref={firstFocusable}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                /*placeholder="cartman"*/ autoComplete="off"
                minLength={3}
                required
              />
              {error ? <p className="error">{error}</p> : null}

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
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

  await fetch("http://localhost:8080/api/v1/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("token", data.token);
    })
    .catch((err) => console.error("Error: ", err));
};

export default function PopOutUsernameDemo() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [open, setOpen] = useState(token ? false : true);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        localStorage.removeItem("token");
        setToken("");
        setOpen(true);
      }
    }
    console.log(`Token je: ${token}`);
  }, [token]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (username.trim().length < 3) {
      setError("Username must have at least 3 characters");
      return;
    }
    setError("");
    console.log(`Submitet username is: ${username}`);
    login(username);
    setOpen(false);
  };

  return (
    <>
      <button onClick={handleOpen}>Log in</button>
      <UsernameModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        value={username}
        onChange={setUsername}
        error={error}
      />
    </>
  );
}
