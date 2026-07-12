"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { loginUser } from "../../../features/auth/authApi";
import { useAppDispatch } from "../../../redux/hooks";
import { setUser } from "../../../features/auth/authSlice";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

// CLIENT COMPONENT — needs form state, Redux dispatch, and router navigation.
export default function LoginPage() {
  const router = useRouter();
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
        router.push(res.data.user.role === "ADMIN" ? "/admin/jobs" : "/dashboard/jobs");
      }
    } catch {
      // handled globally by axiosInstance
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 border rounded-lg p-6 shadow-sm bg-white">
      <h1 className="text-2xl font-semibold text-center">Login</h1>
      <div>
        <label className="text-sm font-medium">Email</label>
        <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label className="text-sm font-medium">Password</label>
        <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
      <p className="text-sm text-center">
        Don&apos;t have an account? <a href="/register" className="text-blue-600 underline">Register</a>
      </p>
    </form>
  );
}
