import Navbar from "../../../components/shared/Navbar";
import Sidebar from "../../../components/shared/Sidebar";
import PageTransition from "../../../components/shared/PageTransition";
import { requireUser } from "../../../lib/auth";

export default async function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  // Server-side auth gate — redirects to /login when the request carries no
  // valid session. Runs before any page data is fetched below.
  await requireUser();

  return (
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
  );
}