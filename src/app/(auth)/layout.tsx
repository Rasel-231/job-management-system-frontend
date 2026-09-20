import PageTransition from "../../components/shared/PageTransition";

// (auth) route group layout — Server Component. Centers auth forms on a
// subtle brand-graded backdrop. proxy.ts already keeps authed users out.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(700px 400px at 20% 0%, hsl(var(--accent)), transparent 70%), radial-gradient(500px 350px at 90% 100%, hsl(var(--primary) / 0.07), transparent 70%)",
      }}
    >
      <div className="absolute left-6 top-6 flex items-center gap-2">
        <span className="text-lg font-bold tracking-tight">
          Job<span className="text-primary">Stack</span>
        </span>
      </div>
      <PageTransition>{children}</PageTransition>
    </div>
  );
}