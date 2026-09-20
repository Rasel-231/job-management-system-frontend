"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { registerUser } from "../../../features/auth/authApi";
import { useAppDispatch } from "../../../redux/hooks";
import { setUser } from "../../../features/auth/authSlice";
import type { TAccountType } from "../../../features/auth/types";
import SocialLoginButtons from "../../../components/shared/SocialLoginButtons";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

type TRoleOption = { value: TAccountType; label: string; hint: string };

const roleOptions: TRoleOption[] = [
  { value: "JOB_SEEKER", label: "Participant", hint: "Find & complete tasks" },
  { value: "JOB_POSTER", label: "Client", hint: "Post & approve jobs" },
  { value: "BOTH", label: "Both", hint: "Do both sides" },
];

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    accountType: "JOB_SEEKER" as TAccountType,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value } as typeof prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await registerUser(formData);
      if (res.data) {
        dispatch(setUser(res.data.user));
        toast.success("Registration successful! Welcome aboard.");
        router.push("/dashboard/jobs");
      }
    } catch {
      // handled globally
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-card p-7 shadow-soft">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Join JobStack in under a minute</p>
      </div>

      <div>
        <label className="text-sm font-medium">I am a</label>
        <div className="grid grid-cols-3 gap-2 mt-1.5">
          {roleOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, accountType: opt.value } as typeof prev))}
              className={`rounded-lg border px-2 py-2 text-xs font-medium transition-all ${
                formData.accountType === opt.value
                  ? "border-primary bg-accent text-accent-foreground ring-1 ring-primary"
                  : "border-input bg-card text-foreground hover:bg-accent/60"
              }`}
            >
              <span className="block font-semibold">{opt.label}</span>
              <span className={`block text-[10px] ${formData.accountType === opt.value ? "text-accent-foreground/80" : "text-muted-foreground"}`}>
                {opt.hint}
              </span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Name</label>
          <Input name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" autoComplete="name" required minLength={2} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Phone</label>
          <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+8801XXXXXXXXX" autoComplete="tel" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Password</label>
          <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 6 characters" autoComplete="new-password" required minLength={6} />
        </div>
        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <SocialLoginButtons
        accountType={formData.accountType}
        redirectBase={() => "/dashboard/jobs"}
      />

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-primary hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}