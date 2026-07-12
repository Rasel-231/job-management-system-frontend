"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { registerUser } from "../../../features/auth/authApi";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerUser(formData);
      toast.success("Registration successful! Awaiting admin approval.");
      router.push("/login");
    } catch {
      // handled globally
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 border rounded-lg p-6 shadow-sm bg-white">
      <h1 className="text-2xl font-semibold text-center">Create an Account</h1>
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input name="name" value={formData.name} onChange={handleChange} required minLength={2} />
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label className="text-sm font-medium">Password</label>
        <Input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </Button>
      <p className="text-sm text-center">
        Already have an account? <a href="/login" className="text-blue-600 underline">Login</a>
      </p>
    </form>
  );
}
