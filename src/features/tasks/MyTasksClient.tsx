"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { completeStepAction, submitProofAction } from "./actions";
import { TTask, TTaskStep } from "./types";
import VerifiedBadge from "../../components/shared/VerifiedBadge";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { cn } from "../../lib/utils";
import type { TBadgeVariant } from "../../components/ui/badge";

const statusBadge: Record<TTask["status"], TBadgeVariant> = {
  PENDING: "warning",
  IN_PROGRESS: "info",
  SUBMITTED: "secondary",
  APPROVED: "success",
  REJECTED: "destructive",
};

// CLIENT COMPONENT — tasks arrive server-side via props; every task
// mutation (step complete / proof submit) is a Server Action.
export default function MyTasksClient({ initialTasks }: { initialTasks: TTask[] }) {
  const [tasks, setTasks] = useState<TTask[]>(initialTasks);

  const [submitTarget, setSubmitTarget] = useState<TTask | null>(null);
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const patchTask = (updated: TTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)));
  };

  const handleCompleteStep = async (task: TTask, step: TTaskStep) => {
    if (step.status === "COMPLETED") return;
    try {
      const updated = await completeStepAction(task.id, step.id);
      patchTask(updated);
      toast.success("Step completed - progress updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update step");
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitTarget) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      if (link) fd.append("submissionLink", link);
      if (note) fd.append("proofNote", note);
      if (file) fd.append("proofFile", file);
      const updated = await submitProofAction(submitTarget.id, fd);
      patchTask(updated);
      toast.success("Proof submitted! Waiting for poster approval.");
      setSubmitTarget(null);
      setLink("");
      setNote("");
      setFile(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit proof");
    } finally {
      setSubmitting(false);
    }
  };

  if (tasks.length === 0)
    return (
      <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
        <p className="font-medium text-foreground">No active tasks yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          You haven&apos;t applied to any jobs — explore the Job Feed to get started.
        </p>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
        <Badge variant="secondary">{tasks.length} task{tasks.length === 1 ? "" : "s"}</Badge>
      </div>

      {tasks.map((task) => (
        <div key={task.id} className="card-shadow space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {task.job.postedBy.avatarUrl ? (
                <Image src={task.job.postedBy.avatarUrl} alt="" width={36} height={36} className="rounded-full" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground">
                  {task.job.postedBy.name[0]}
                </div>
              )}
              <div>
                <h2 className="font-semibold tracking-tight">{task.job.title}</h2>
                <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  {task.job.postedBy.name} {task.job.postedBy.isVerified && <VerifiedBadge size={10} />}
                </p>
              </div>
            </div>
            <Badge variant={statusBadge[task.status]} className="shrink-0">
              {task.status.replace("_", " ")}
            </Badge>
          </div>

          {/* Progress bar */}
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-semibold text-foreground">{task.progress}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  task.progress === 100 ? "bg-emerald-500" : "bg-primary"
                )}
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          {task.taskSteps.length > 0 && (
            <ul className="space-y-2">
              {task.taskSteps
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((step) => {
                  const done = step.status === "COMPLETED";
                  return (
                    <li key={step.id} className="flex items-start gap-3">
                      {task.status === "IN_PROGRESS" || task.status === "PENDING" ? (
                        <Checkbox
                          checked={done}
                          disabled={task.status !== "IN_PROGRESS" || done}
                          onChange={() => void handleCompleteStep(task, step)}
                          className="mt-0.5"
                        />
                      ) : (
                        <span
                          className={cn(
                            "mt-0.5 flex h-4 w-4 items-center justify-center rounded border text-[10px]",
                            done ? "border-emerald-500 bg-emerald-500 text-white" : "border-input"
                          )}
                        >
                          {done ? "✓" : ""}
                        </span>
                      )}
                      <div>
                        <p className={cn("text-sm font-medium", done && "text-muted-foreground line-through")}>
                          {step.title}
                        </p>
                        {step.description && <p className="text-xs text-muted-foreground">{step.description}</p>}
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}

          {/* proof link/file */}
          {(task.submissionLink || task.proofFileUrl || task.proofNote) && (
            <div className="space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
              {task.submissionLink && (
                <p>
                  <span className="font-medium text-foreground">Submission:</span>{" "}
                  <a href={task.submissionLink} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    {task.submissionLink}
                  </a>
                </p>
              )}
              {task.proofFileUrl && (
                <p>
                  <span className="font-medium text-foreground">Proof file:</span>{" "}
                  <a href={task.proofFileUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    View file
                  </a>
                </p>
              )}
              {task.proofNote && <p className="whitespace-pre-line">{task.proofNote}</p>}
            </div>
          )}

          {task.rejectionNote && (
            <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              Rejection note: {task.rejectionNote}
            </p>
          )}

          {/* action buttons */}
          {task.status === "IN_PROGRESS" && (
            <div className="flex justify-end">
              <Button onClick={() => setSubmitTarget(task)} disabled={task.taskSteps.length > 0 && task.progress < 100}>
                {task.taskSteps.length > 0 && task.progress < 100 ? "Finish steps to submit" : "Submit Proof"}
              </Button>
            </div>
          )}
          {task.status === "APPROVED" && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-right text-sm font-medium text-emerald-700">
              Approved — ৳{task.job.reward.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} credited to wallet
            </p>
          )}
        </div>
      ))}

      {submitTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setSubmitTarget(null)}>
          <form
            className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-6 shadow-lift"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmitProof}
          >
            <h2 className="text-lg font-semibold tracking-tight">Submit proof — {submitTarget.job.title}</h2>
            {submitTarget.taskSteps.length > 0 && (
              <p className="text-xs text-muted-foreground">All steps must be completed before submitting.</p>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Submission Link</label>
              <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Proof Note</label>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Describe what you completed..." />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Proof File (screenshot)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-accent"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setSubmitTarget(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} isLoading={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}