"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { applyForJob } from "../../features/tasks/taskApi";
import { useAppSelector } from "../../redux/hooks";
import { Button } from "../../components/ui/button";

export default function ApplyButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    if (!user) {
      toast.info("Login required to apply");
      router.push("/login");
      return;
    }
    setApplying(true);
    try {
      await applyForJob(jobId);
      setApplied(true);
      toast.success("Applied! Track progress from My Tasks.");
    } catch {
      // handled globally
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