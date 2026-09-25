"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../features/auth/authSlice";
import { logoutAction } from "../../features/auth/actions";
import { adminLinks, userLinks } from "./Sidebar";
import VerifiedBadge from "./VerifiedBadge";
import ThemeToggle from "./ThemeToggle";
import { Button } from "../ui/button";
import { Icon } from "../ui/icons";
import { cn } from "../../lib/utils";

const roleLabels: Record<string, string> = {
  JOB_SEEKER: "Participant",
  JOB_POSTER: "Client",
  BOTH: "Participant + Client",
};

export default function Navbar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    // Run the server action FIRST so cookies are cleared before the UI flips —
    // otherwise a failed logout leaves the UI logged out while cookies persist.
    try {
      await logoutAction();
    } catch {
      toast.error("Logout failed — please try again");
      return;
    }
    dispatch(logout());
    setMenuOpen(false);
    toast.success("Logged out successfully");
  };

  const closeMenu = () => setMenuOpen(false);

  const userInfo = user ? (
    <div className="text-right">
      <p className="inline-flex items-center gap-1.5 text-sm font-medium">
        {user.name}
        {user.isVerified && <VerifiedBadge size={12} />}
      </p>
      <p className="text-xs text-muted-foreground">
        {user.role === "ADMIN" ? "Administrator" : roleLabels[user.accountType]}
        {!user.isVerified && user.role !== "ADMIN" && (
          <Link
            href="/dashboard/verification"
            className={cn("ml-1.5 font-medium text-primary hover:underline")}
          >
            Verify now
          </Link>
        )}
      </p>
    </div>
  ) : null;

  const desktopNav = user ? (
    <>
      {userInfo}
      <Link
        href={user.role === "ADMIN" ? "/admin/jobs" : "/dashboard"}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        <Icon name="grid" className="h-4 w-4" />
        Dashboard
      </Link>
      <Link
        href={user.role === "ADMIN" ? "/admin/profile" : "/dashboard/profile"}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label="Profile"
      >
        <Icon name="user" className="h-4 w-4" />
      </Link>
      <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
        <Icon name="logout" className="h-3.5 w-3.5" />
        Logout
      </Button>
    </>
  ) : (
    <>
      <Link
        href="/jobs"
        onClick={closeMenu}
        className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        Browse jobs
      </Link>
      <Link
        href="/login"
        onClick={closeMenu}
        className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        Login
      </Link>
      <Link
        href="/register"
        onClick={closeMenu}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
      >
        Get started
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-3">
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Icon name="grid" className="h-4 w-4" />
          </span>
          Pay<span className="text-primary">Task</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <nav className="hidden items-center gap-4 lg:flex">{desktopNav}</nav>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <Icon name={menuOpen ? "x" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-border px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-3">
{user ? (
  <>
    <div className="text-start">{userInfo}</div>
    <div className="h-px bg-border" />
    <div className="flex flex-col gap-1">
      {(user.role === "ADMIN" ? adminLinks : userLinks).map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={closeMenu}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <Icon name={link.icon} className="h-4 w-4 shrink-0" />
          {link.label}
        </Link>
      ))}
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-accent"
      >
        <Icon name="logout" className="h-4 w-4" />
        Logout
      </button>
    </div>
  </>
) : (
              <div className="flex flex-col gap-1">
                <Link
                  href="/jobs"
                  onClick={closeMenu}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <Icon name="briefcase" className="h-4 w-4" />
                  Browse jobs
                </Link>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <Icon name="user" className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="mt-2 flex items-center justify-center gap-2.5 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}