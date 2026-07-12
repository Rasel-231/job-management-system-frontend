"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

type TSidebarLink = { label: string; href: string };

const adminLinks: TSidebarLink[] = [
  { label: "Jobs", href: "/admin/jobs" },
  { label: "User Approval", href: "/admin/users" },
  { label: "Tasks", href: "/admin/tasks" },
  { label: "Transactions", href: "/admin/transactions" },
];

const userLinks: TSidebarLink[] = [
  { label: "Job Market", href: "/dashboard/jobs" },
  { label: "My Tasks", href: "/dashboard/my-tasks" },
  { label: "Earnings", href: "/dashboard/earnings" },
];

export default function Sidebar({ role }: { role: "ADMIN" | "USER" }) {
  const pathname = usePathname();
  const links = role === "ADMIN" ? adminLinks : userLinks;

  return (
    <aside className="w-56 border-r min-h-screen bg-gray-50 p-4 space-y-1">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link key={link.href} href={link.href} className="relative block">
            <motion.div
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive ? "bg-black text-white" : "text-gray-600 hover:bg-gray-200"
              )}
              whileTap={{ scale: 0.97 }}
            >
              {link.label}
            </motion.div>
          </Link>
        );
      })}
    </aside>
  );
}
