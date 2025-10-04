// src/utils/logout.js
import toast from "react-hot-toast";

export const handleLogout = (navigate) => {
  // Remove stored token
  localStorage.removeItem("token");

  // Optional: Clear axios auth header globally if set
  // delete axios.defaults.headers.common["Authorization"];

  toast.success("You have been logged out!");

  // Redirect to login after short delay
  setTimeout(() => {
    navigate("/login");
  }, 1000);
};
