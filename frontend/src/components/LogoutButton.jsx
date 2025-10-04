import { Logout } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../utils/logout";

export default function LogoutButton({ variant = "text", color = "inherit" }) {
  const navigate = useNavigate();

  return (
    <Button
      variant={variant}
      color={color}
      startIcon={<Logout />}
      onClick={() => handleLogout(navigate)}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        color: "#333333",
        "&:hover": { bgcolor: "#f2f2f2" },
      }}
    >
      Logout
    </Button>
  );
}
