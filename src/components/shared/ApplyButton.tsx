"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { applyForJob } from "../../features/tasks/taskApi";
import { Button } from "../../components/ui/button";

export default function ApplyButton({ jobId }: { jobId: string }) {
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
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