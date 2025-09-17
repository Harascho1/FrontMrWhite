import { AnimatePresence, motion } from "framer-motion";
import "./AlertWindow.css";
import { useRef } from "react";

export default function AlertWindow({ isOpen, text, onClose }) {
  const overlayRef = useRef(null);
  const windowRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="overlay"
        ref={overlayRef}
        onMouseDown={handleOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="window"
          ref={windowRef}
          initial={{ scale: 0.92, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", shiftness: 260, damping: 20 }}
        >
          <p>{text}</p>
          <div className="button-div">
            <button type="button" onClick={onClose} className="btn-secondary">
              OK
            </button>
          </div>
        </motion.div>
      </motion.div>
      )
    </AnimatePresence>
  );
}
