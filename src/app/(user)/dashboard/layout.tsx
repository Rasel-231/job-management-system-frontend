import Navbar from "../../../components/shared/Navbar";
import Sidebar from "../../../components/shared/Sidebar";
import RoleGuard from "../../../components/shared/RoleGuard";
import PageTransition from "../../../components/shared/PageTransition";
import { Permission } from "../../../lib/permissions";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard requiredPermission={Permission.TASK_APPLY}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 bg-muted/30">
          <Sidebar role="USER" />
          <main className="min-w-0 flex-1">
            <div className="mx-auto max-w-5xl animate-grid-fade p-6 lg:p-8">
              <PageTransition>{children}</PageTransition>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
