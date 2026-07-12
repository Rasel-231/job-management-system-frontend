"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../features/auth/authSlice";
import { logoutUser } from "../../features/auth/authApi";
import { Button } from "../ui/button";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // proceed to clear client state regardless
    }
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
      <h1 className="font-semibold text-lg">Job Management System</h1>
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-right">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        )}
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
