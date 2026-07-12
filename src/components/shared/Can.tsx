"use client";

import { ReactNode } from "react";
import { useAppSelector } from "../../redux/hooks";
import { hasPermission, Permission } from "../../lib/permissions";

type TCanProps = {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
};

// Client-side UX gate — hides actions the user's role can't perform.
// Cosmetic only; the backend authorize() middleware is the real gate.
export default function Can({ permission, children, fallback = null }: TCanProps) {
  const role = useAppSelector((state) => state.auth.user?.role);

  if (!hasPermission(role, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
