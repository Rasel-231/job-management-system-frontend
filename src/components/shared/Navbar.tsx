"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../features/auth/authSlice";
import { logoutUser } from "../../features/auth/authApi";
import VerifiedBadge from "./VerifiedBadge";
import { Button } from "../ui/button";
import { Icon } from "../ui/icons";
import { cn } from "../../lib/utils";

const roleLabels: Record<string, string> = {
  JOB_SEEKER: "Participant",
  JOB_POSTER: "Client",
  BOTH: "Participant + Client",
};

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
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/80 px-6 py-3 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Icon name="grid" className="h-4 w-4" />
        </span>
        Job<span className="text-primary">Stack</span>
      </Link>
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-right">
            <p className="inline-flex items-center gap-1.5 text-sm font-medium">
              {user.name}
              {user.isVerified && <VerifiedBadge size={12} />}
            </p>
            <p className="text-xs text-muted-foreground">
              {user.role === "ADMIN" ? "Administrator" : roleLabels[user.accountType]}
              {!user.isVerified && user.role !== "ADMIN" && (
                <Link href="/dashboard/verification" className={cn("ml-1.5 font-medium text-primary hover:underline")}>
                  Verify now
                </Link>
              )}
            </p>
          </div>
        )}
        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
          <Icon name="logout" className="h-3.5 w-3.5" />
          Logout
        </Button>
      </div>
    </header>
  );
}