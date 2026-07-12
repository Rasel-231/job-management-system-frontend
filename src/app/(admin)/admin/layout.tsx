import Navbar from "../../../components/shared/Navbar";
import Sidebar from "../../../components/shared/Sidebar";
import RoleGuard from "../../../components/shared/RoleGuard";
import PageTransition from "../../../components/shared/PageTransition";
import { Permission } from "../../../lib/permissions";

// Server Component shell + client-side RoleGuard as the second (UX) layer
// of defense, behind proxy.ts which already gate-kept at the network edge.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard requiredPermission={Permission.USER_VIEW_ALL}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar role="ADMIN" />
          <main className="flex-1 p-6">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
