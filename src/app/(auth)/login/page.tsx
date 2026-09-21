"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { loginUser } from "../../../features/auth/authApi";
import { useAppDispatch } from "../../../redux/hooks";
import { setUser } from "../../../features/auth/authSlice";
import SocialLoginButtons from "../../../components/shared/SocialLoginButtons";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

// CLIENT COMPONENT — needs form state, Redux dispatch, and router navigation.
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
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
      const res = await loginUser(formData);
      if (res.data) {
        dispatch(setUser(res.data.user));
        toast.success("Logged in successfully");
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.push(res.data.user.role === "ADMIN" ? "/admin/jobs" : "/jobs");
        }
      }
    } catch {
      // handled globally by axiosInstance
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-card p-7 shadow-soft">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to JobStack</p>
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
        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <SocialLoginButtons accountType="JOB_SEEKER" redirectBase={() => redirectTo ?? "/jobs"} />

      <p className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a href="/register" className="font-medium text-primary hover:underline">
          Register
        </a>
      </p>
    </div>
  );
}