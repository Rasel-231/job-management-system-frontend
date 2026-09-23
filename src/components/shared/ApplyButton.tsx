"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { applyForJobAction } from "../../features/tasks/actions";
import { useAppSelector } from "../../redux/hooks";
import { Button } from "../../components/ui/button";

// `hasApplied` is computed on the server (Server Component fetches My Tasks
// for the request's logged-in user). Applying itself is a Server Action so
// the httpOnly cookie is never exposed to the browser.
export default function ApplyButton({ jobId, hasApplied = false }: { jobId: string; hasApplied?: boolean }) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [applying, setApplying] = useState(false);
  const [appliedNow, setAppliedNow] = useState(false);

  const applied = hasApplied || appliedNow;

  const handleApply = async () => {
    if (!user) {
      toast.info("Login required to apply");
      router.push("/login");
      return;
    }
    setApplying(true);
    try {
      await applyForJobAction(jobId);
      setAppliedNow(true);
      toast.success("Applied! Track progress from My Tasks.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  return (
    <Button className="w-full" disabled={applying || applied} isLoading={applying} onClick={handleApply}>
      {applied ? "Applied" : applying ? "Applying..." : "Apply now"}
    </Button>
  );
}