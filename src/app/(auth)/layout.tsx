import Navbar from "../../components/shared/Navbar";
import PageTransition from "../../components/shared/PageTransition";

// (auth) route group layout — Server Component. Renders the shared dynamic
// Navbar (reflecting the user's login state) and centers auth forms on a
// subtle brand-graded backdrop. /login is always reachable so a stale
// refreshToken cookie can't trap logged-out users in a redirect loop.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex min-h-screen flex-col"
      style={{
        background:
          "radial-gradient(700px 400px at 20% 0%, hsl(var(--accent)), transparent 70%), radial-gradient(500px 350px at 90% 100%, hsl(var(--primary) / 0.07), transparent 70%)",
      }}
    >
      <Navbar />
      <div className="flex flex-1 items-center justify-center p-4">
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  );
}