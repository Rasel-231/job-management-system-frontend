import Link from "next/link";
import { Badge } from "../components/ui/badge";
import ThemeToggle from "../components/shared/ThemeToggle";

const features = [
  {
    title: "Post Jobs & Track Progress",
    description:
      "Break any job into verifiable milestones. Watch each participant's completion bar fill up in real time.",
  },
  {
    title: "Earn & Withdraw",
    description:
      "Every approved step credits your wallet instantly. Withdraw to bKash, Nagad or bank whenever you want.",
  },
  {
    title: "Trust, Built In",
    description:
      "Verified identities, an admin dispute desk, and escrowed rewards keep both sides protected.",
  },
];

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 500px at 50% -8%, hsl(var(--accent)), transparent 70%), radial-gradient(500px 300px at 90% 20%, hsl(var(--primary) / 0.08), transparent 70%)",
        }}
      />

      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-lg font-bold tracking-tight">
          Job<span className="text-primary">Stack</span>
        </span>
        <nav className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/jobs"
            className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Browse jobs
          </Link>
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-6 py-14 text-center">
        <Badge variant="outline" className="mb-5 rounded-full px-3 py-1 text-xs">
          Freelance micro-tasks made verifiable
        </Badge>

        <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Earn money one{" "}
          <span className="bg-gradient-to-r from-primary to-fuchsia-600 bg-clip-text text-transparent">
            milestone
          </span>{" "}
          at a time
        </h1>

        <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          Post jobs with proof-based steps, complete tasks phase by phase, and get paid to your wallet the
          moment your work is approved.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
          >
            Create free account
          </Link>
          <Link
            href="/jobs"
            className="rounded-lg border border-input bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent"
          >
            Browse open jobs
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span>✓ Free to join</span>
          <span>✓ Instant payouts</span>
          <span>✓ Admin-protected disputes</span>
        </div>

        <section className="mt-20 grid w-full gap-4 text-left sm:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card-shadow group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
                {("0" + (i + 1)).slice(-2)}
              </div>
              <h3 className="font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border/70 py-6 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-6 sm:flex-row">
          <span>
            Job<span className="font-semibold text-primary">Stack</span>
          </span>
          <span>© {new Date().getFullYear()} — Secure, milestone-based freelancing.</span>
        </div>
      </footer>
    </div>
  );
}