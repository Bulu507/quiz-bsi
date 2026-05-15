"use client";

import { LogOut } from "lucide-react";
import { useLogout } from "../application/hooks/useLogout";

export function LogoutButton({ variant = "nav" }: { variant?: "nav" | "button" }) {
  const logout = useLogout();

  if (variant === "button") {
    return (
      <button className="btn" onClick={() => void logout()} type="button">
        <LogOut size={16} />
        Logout
      </button>
    );
  }

  return (
    <button className="nav-item" onClick={() => void logout()} type="button">
      <LogOut size={18} />
      Logout
    </button>
  );
}
