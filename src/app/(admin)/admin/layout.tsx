import Navbar from "../../../components/shared/Navbar";
import Sidebar from "../../../components/shared/Sidebar";
import PageTransition from "../../../components/shared/PageTransition";
import { requireAdmin } from "../../../lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side auth gate — only ACTIVE admins pass. Runs before any page data
  // below is fetched; proxy.ts already gate-kept at the network edge.
  await requireAdmin();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 bg-muted/30">
        <Sidebar role="ADMIN" />
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl animate-grid-fade p-6 lg:p-8">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}