import Navbar from "../../../components/shared/Navbar";
import Sidebar from "../../../components/shared/Sidebar";
import RoleGuard from "../../../components/shared/RoleGuard";
import PageTransition from "../../../components/shared/PageTransition";
import JobCartDrawer from "../../../features/jobs/JobCartDrawer";
import { Permission } from "../../../lib/permissions";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard requiredPermission={Permission.TASK_SUBMIT}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar role="USER" />
          <main className="flex-1">
            <div className="flex justify-end p-4 border-b bg-white">
              <JobCartDrawer />
            </div>
            <div className="p-6">
              <PageTransition>{children}</PageTransition>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
