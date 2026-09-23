"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { loginAction } from "../../../features/auth/actions";
import { useAppDispatch } from "../../../redux/hooks";
import { setUser } from "../../../features/auth/authSlice";
import SocialLoginButtons from "../../../components/shared/SocialLoginButtons";
import BackButton from "../../../components/shared/BackButton";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Icon } from "../../../components/ui/icons";

const features = [
  { icon: "briefcase", title: "Find & post jobs", desc: "Browse tasks or hire talent all in one place." },
  { icon: "shield", title: "Secure payments", desc: "Escrow-backed payments keep both sides safe." },
  { icon: "scale", title: "Fair disputes", desc: "Raise and resolve disputes transparently." },
] as const;

// CLIENT COMPONENT — needs form state, Redux dispatch, and router navigation.
// The actual login is a Server Action (loginAction) so the httpOnly auth
// cookies are issued server-side, never accessible to JS.
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirectTo");
  const redirectTo =
    rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") ? rawRedirect : undefined;
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await loginAction({ email: formData.email, password: formData.password });
      if (res.ok) {
        dispatch(setUser(res.user));
        toast.success("Logged in successfully");
        router.push(redirectTo ?? (res.user.role === "ADMIN" ? "/admin/jobs" : "/jobs"));
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Could not sign in — try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="grid md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground md:flex">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-foreground/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-primary-foreground/10 blur-2xl" />

          <div className="relative flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">PayTask</span>
          </div>

          <div className="relative space-y-8">
            <div>
              <h2 className="text-2xl font-bold leading-snug tracking-tight">
                Your work, managed in one place.
              </h2>
              <p className="mt-2 text-sm text-primary-foreground/75">
                Join thousands of participants and clients building together on PayTask.
              </p>
            </div>

            <ul className="space-y-4">
              {features.map((f) => (
                <li key={f.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15 ring-1 ring-primary-foreground/20">
                    <Icon name={f.icon} className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{f.title}</span>
                    <span className="block text-xs text-primary-foreground/70">{f.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex items-center gap-2 text-xs text-primary-foreground/70">
            <Icon name="shield" className="h-4 w-4" />
            Trusted by participants &amp; clients across Bangladesh
          </div>
        </div>

        <div className="flex flex-col justify-center p-7 sm:p-10">
          <BackButton className="mb-6 self-start" />
          <div className="mb-6 text-center md:text-left">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to PayTask</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Password</label>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" autoComplete="current-password" required />
            </div>
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or continue with</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <SocialLoginButtons accountType="JOB_SEEKER" redirectBase={() => redirectTo ?? "/jobs"} />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a href="/register" className="font-medium text-primary hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}