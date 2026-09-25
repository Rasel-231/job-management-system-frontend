"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Icon, type TIconName } from "../ui/icons";

type TSidebarLink = { label: string; href: string; icon: TIconName };

export const adminLinks: TSidebarLink[] = [
  { label: "Jobs", href: "/admin/jobs", icon: "briefcase" },
  { label: "Verifications", href: "/admin/verifications", icon: "shield" },
  { label: "Withdrawals", href: "/admin/withdrawals", icon: "banknote" },
  { label: "Disputes", href: "/admin/disputes", icon: "scale" },
  { label: "Users", href: "/admin/users", icon: "users" },
  { label: "Tasks", href: "/admin/tasks", icon: "checklist" },
  { label: "Transactions", href: "/admin/transactions", icon: "history" },
  { label: "Profile", href: "/admin/profile", icon: "user" },
];

export const userLinks: TSidebarLink[] = [
  { label: "Overview", href: "/dashboard", icon: "grid" },
  { label: "Job Feed", href: "/jobs", icon: "briefcase" },
  { label: "My Tasks", href: "/dashboard/my-tasks", icon: "checklist" },
  { label: "My Posted Jobs", href: "/dashboard/my-jobs", icon: "history" },
  { label: "Wallet & Earnings", href: "/dashboard/earnings", icon: "wallet" },
  { label: "Verification", href: "/dashboard/verification", icon: "shield" },
  { label: "Disputes", href: "/dashboard/disputes", icon: "scale" },
  { label: "Profile", href: "/dashboard/profile", icon: "user" },
];

export default function Sidebar({ role }: { role: "ADMIN" | "USER" }) {
  const pathname = usePathname();
  const links = role === "ADMIN" ? adminLinks : userLinks;

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-card/60 p-4 lg:block">
      <nav className="sticky top-4 space-y-1">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {role === "ADMIN" ? "Administration" : "Dashboard"}
        </p>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className="relative block">
              <motion.div
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                whileTap={{ scale: 0.97 }}
              >
                <Icon name={link.icon} className="h-4 w-4 shrink-0" />
                {link.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}