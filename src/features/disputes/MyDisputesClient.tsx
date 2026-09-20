"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createDispute, getMyDisputes } from "./disputeApi";
import { TDispute } from "./types";
import { getMyJobs } from "../jobs/jobApi";
import { getMyTasks } from "../tasks/taskApi";
import { TTask } from "../tasks/types";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Badge, type TBadgeVariant } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const statusBadge: Record<TDispute["status"], TBadgeVariant> = {
  OPEN: "destructive",
  RESOLVED: "success",
  REJECTED: "secondary",
};

export default function MyDisputesClient() {
  const [disputes, setDisputes] = useState<TDispute[]>([]);
  const [loading, setLoading] = useState(true);

  const [jobOptions, setJobOptions] = useState<{ id: string; title: string }[]>([]);
  const [tasks, setTasks] = useState<TTask[]>([]);
  const [jobId, setJobId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [respondentEmail, setRespondentEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setDisputes(await getMyDisputes());
      const [myJobs, myTasks] = await Promise.all([getMyJobs(), getMyTasks()]);
      setTasks(myTasks);
      const seen = new Set<string>();
      setJobOptions([
        ...myJobs.map((j) => {
          seen.add(j.id);
          return { id: j.id, title: j.title };
        }),
        ...myTasks
          .map((t) => ({ id: t.job.id, title: t.job.title }))
          .filter((j) => !seen.has(j.id)),
      ]);
    } catch {
      // handled globally
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId || !reason.trim()) {
      toast.error("Job and reason are required");
      return;
    }
    setSubmitting(true);
    try {
      const dispute = await createDispute({
        jobId,
        taskId: taskId || undefined,
        reason,
        respondentEmail: respondentEmail || undefined,
      });
      setDisputes((prev) => [dispute, ...prev]);
      setReason("");
      setJobId("");
      setTaskId("");
      setRespondentEmail("");
      toast.success("Dispute opened — awaiting admin review");
    } catch {
      // handled globally
    } finally {
      setSubmitting(false);
    }
  };

  const selectedJobTasks = tasks.filter((t) => t.job.id === jobId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Disputes</h1>

      <section className="card-shadow space-y-4 rounded-xl border border-border bg-card p-5">
        <div>
          <h2 className="font-semibold tracking-tight">Open a dispute</h2>
          <p className="text-xs text-muted-foreground">
            Raise an issue about a job or task so an admin can arbitrate.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Related job</label>
            <Select className="w-full" value={jobId} onChange={(e) => { setJobId(e.target.value); setTaskId(""); }}>
              <option value="">Select job...</option>
              {jobOptions.map((j) => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Related task (optional)</label>
            <Select className="w-full" value={taskId} onChange={(e) => setTaskId(e.target.value)} disabled={!jobId}>
              <option value="">Select task...</option>
              {selectedJobTasks.map((t) => (
                <option key={t.id} value={t.id}>{t.job.title} — {t.status}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Respondent</label>
            <Input value={respondentEmail} onChange={(e) => setRespondentEmail(e.target.value)} placeholder="Respondent's exact email" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Reason / details</label>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} required />
          </div>
          <Button type="submit" className="w-full" disabled={submitting} isLoading={submitting}>
            {submitting ? "Opening..." : "Open dispute"}
          </Button>
        </form>
      </section>

      <section className="card-shadow overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <h2 className="font-semibold tracking-tight">My disputes</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Against</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Resolution</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="py-6 text-center text-muted-foreground">Loading...</TableCell></TableRow>
            ) : disputes.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="py-6 text-center text-muted-foreground">No disputes</TableCell></TableRow>
            ) : (
              disputes.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="text-sm">{d.job.title}</TableCell>
                  <TableCell className="text-sm">{d.respondent.name}</TableCell>
                  <TableCell className="max-w-[200px] text-sm"><p className="truncate" title={d.reason}>{d.reason}</p></TableCell>
                  <TableCell>
                    <Badge variant={statusBadge[d.status]}>{d.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{d.resolution ?? "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}