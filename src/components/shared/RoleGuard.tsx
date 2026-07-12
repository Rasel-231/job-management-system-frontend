"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../redux/hooks";
import { hasPermission, Permission } from "../../lib/permissions";

type TRoleGuardProps = {
  requiredPermission: Permission;
  children: ReactNode;
};

// Client-side UX layer, runs AFTER proxy.ts has already redirected
// unauthenticated/wrong-role navigations at the network boundary.
// This catches the in-app case: e.g. a session expiring while the user
// is already sitting on a protected page.
export default function RoleGuard({ requiredPermission, children }: TRoleGuardProps) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user || user.status !== "ACTIVE") {
      router.push("/login");
      return;
    }
    if (!hasPermission(user.role, requiredPermission)) {
      router.push("/login");
      return;
    }
    setChecked(true);
  }, [user, requiredPermission, router]);

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-6 w-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
