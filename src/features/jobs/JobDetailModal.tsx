"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { TJob, categoryLabels } from "./types";
import VerifiedBadge from "../../components/shared/VerifiedBadge";
import { applyForJob } from "../tasks/taskApi";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

type TJobDetailModalProps = {
  job: TJob | null;
  onClose: () => void;
};

export default function JobDetailModal({ job, onClose }: TJobDetailModalProps) {
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    if (!job) return;
    setApplying(true);
    try {
      await applyForJob(job.id);
      setApplied(true);
    } catch {
      // handled globally
    } finally {
      setApplying(false);
    }
  };

  return (
    <AnimatePresence>
      {job && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="my-8 w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-lift"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {job.imageUrl && (
              <div className="relative h-56 w-full overflow-hidden">
                <Image src={job.imageUrl} alt={job.title} fill className="object-cover" />
              </div>
            )}

            <div className="space-y-5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{categoryLabels[job.category]}</Badge>
                    <Badge variant={job.status === "OPEN" ? "success" : "warning"}>{job.status}</Badge>
                  </div>
                  <h1 className="mt-2 text-2xl font-bold tracking-tight">{job.title}</h1>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">৳ {job.reward.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-xs text-muted-foreground">Budget</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {job.postedBy.avatarUrl ? (
                  <Image src={job.postedBy.avatarUrl} alt="" width={36} height={36} className="rounded-full" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                    {job.postedBy.name[0]}
                  </div>
                )}
                <div>
                  <p className="inline-flex items-center gap-1 text-sm font-medium">
                    {job.postedBy.name}
                    {job.postedBy.isVerified && <VerifiedBadge size={12} />}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {job.deadline ? `Deadline: ${new Date(job.deadline).toLocaleDateString()}` : "No deadline"}
                  </p>
                </div>
              </div>

              {job.description && (
                <div>
                  <h3 className="text-sm font-semibold">Description</h3>
                  <p className="mt-1 text-sm whitespace-pre-line text-muted-foreground">{job.description}</p>
                </div>
              )}

              {job.requirements && (
                <div>
                  <h3 className="text-sm font-semibold">Requirements</h3>
                  <p className="mt-1 text-sm whitespace-pre-line text-muted-foreground">{job.requirements}</p>
                </div>
              )}

              {job.steps && job.steps.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold">Milestones</h3>
                  <ol className="mt-1.5 list-decimal space-y-1.5 pl-1 list-inside">
                    {job.steps
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((step) => (
                        <li key={step.id} className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{step.title}</span>
                          {step.description && <span className="text-muted-foreground"> — {step.description}</span>}
                        </li>
                      ))}
                  </ol>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold">Proof Requirements</h3>
                <p className="mt-1 text-sm text-muted-foreground">{job.proofRequirements}</p>
              </div>

              <Button
                className="w-full"
                disabled={applied || applying}
                isLoading={applying}
                onClick={handleApply}
              >
                {applied ? "Application sent" : applying ? "Applying..." : "Apply now"}
              </Button>

              <button
                onClick={onClose}
                className="w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}