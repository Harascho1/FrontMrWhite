import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import UsernameModal from "../UsernameModal/UsernameModal";
import { useState, useEffect } from "react";

export default function Layout() {
  const [showModal, setShowModal] = useState(false);

  const checkIfLoggedOn = () => {
    const token = localStorage.getItem("token");
    if (token) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!checkIfLoggedOn()) {
      setShowModal(true);
    }
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <UsernameModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      />
    </>
  );
}
