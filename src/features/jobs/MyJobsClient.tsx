"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { acceptApplicationAction, reviewTaskAction } from "../tasks/actions";
import { TJob, categoryLabels } from "./types";
import { TTask } from "../tasks/types";
import VerifiedBadge from "../../components/shared/VerifiedBadge";
import NoteDialog from "../../components/shared/NoteDialog";
import { Button } from "../../components/ui/button";
import { Badge, type TBadgeVariant } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { cn } from "../../lib/utils";

const statusBadge: Record<TTask["status"], TBadgeVariant> = {
  PENDING: "warning",
  IN_PROGRESS: "info",
  SUBMITTED: "secondary",
  APPROVED: "success",
  REJECTED: "destructive",
};

// CLIENT COMPONENT — jobs + their applications are fetched server-side by the
// page; accepting/reviewing applications are Server Actions.
type TMyJobsClientProps = {
  initialJobs: TJob[];
  initialApplicationsByJob: Record<string, TTask[]>;
};

export default function MyJobsClient({ initialJobs, initialApplicationsByJob }: TMyJobsClientProps) {
  const [jobs, setJobs] = useState<TJob[]>(initialJobs);
  const [applicationsByJob, setApplicationsByJob] = useState<Record<string, TTask[]>>(initialApplicationsByJob);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<TTask | null>(null);

  const run = async (id: string, fn: () => Promise<TTask>, successMessage?: string) => {
    setBusy(id);
    try {
      const updated = await fn();
      if (successMessage) toast.success(successMessage);
      setApplicationsByJob((prev) => {
        const next: Record<string, TTask[]> = {};
        for (const [jobId, list] of Object.entries(prev)) {
          next[jobId] = list.map((t) => (t.id === updated.id ? { ...t, ...updated } : t));
        }
        return next;
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusy(null);
    }
  };

  if (jobs.length === 0)
    return (
      <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
        <p className="font-medium text-foreground">No posted jobs yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Post your first job to start receiving applications.</p>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">My posted jobs</h1>

      {jobs.map((job) => {
        const apps = applicationsByJob[job.id] ?? [];
        const isOpen = expanded[job.id];
        return (
          <div key={job.id} className="card-shadow overflow-hidden rounded-xl border border-border bg-card">
            <button
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-accent/50"
              onClick={() => setExpanded((prev) => ({ ...prev, [job.id]: !prev[job.id] }))}
              aria-expanded={isOpen}
              aria-controls={`applications-${job.id}`}
            >
              <div>
                <h2 className="font-semibold tracking-tight">{job.title}</h2>
                <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{categoryLabels[job.category]}</span>
                  <Badge variant={job.status === "OPEN" ? "success" : "secondary"}>{job.status}</Badge>
                  <span>{apps.length} application{apps.length === 1 ? "" : "s"}</span>
                </p>
              </div>
              <span className={cn("text-muted-foreground transition-transform", isOpen && "rotate-180")}>▾</span>
            </button>

            {isOpen && (
              <div id={`applications-${job.id}`} className="border-t border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Seeker</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apps.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                          No applications yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      apps.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <p className="inline-flex items-center gap-1 text-sm font-medium">
                              {task.user?.name ?? "User"} {task.user?.isVerified && <VerifiedBadge size={10} />}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Reward: ৳{task.job.reward.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              {task.submissionLink && (
                                <> • <a href={task.submissionLink} target="_blank" rel="noopener noreferrer" className="text-primary underline">proof link</a></>
                              )}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                                <div
                                  className={cn("h-full", task.progress === 100 ? "bg-emerald-500" : "bg-primary")}
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                              <span className="text-xs">{task.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusBadge[task.status]} className="whitespace-nowrap">
                              {task.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="space-x-1 whitespace-nowrap text-right">
                            {task.status === "PENDING" && (
                              <Button
                                size="sm"
                                disabled={busy === task.id}
                                onClick={() => void run(task.id, () => acceptApplicationAction(task.id), "Application accepted")}
                              >
                                Accept
                              </Button>
                            )}
                            {task.status === "SUBMITTED" && (
                              <>
                                <Button
                                  size="sm"
                                  disabled={busy === task.id}
                                  onClick={() => void run(task.id, () => reviewTaskAction(task.id, "APPROVED"), "Approved — wallet credited")}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={busy === task.id}
                                  onClick={() => setRejectTarget(task)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        );
      })}

      <NoteDialog
        open={!!rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        title="Reject application"
        label="Rejection note"
        placeholder="Tell the participant why their proof was rejected."
        confirmText="Reject"
        isLoading={busy === rejectTarget?.id}
        onConfirm={(note) => {
          if (!rejectTarget) return;
          const { id } = rejectTarget;
          setRejectTarget(null);
          void run(id, () => reviewTaskAction(id, "REJECTED", note || undefined));
        }}
      />
    </div>
  );
}