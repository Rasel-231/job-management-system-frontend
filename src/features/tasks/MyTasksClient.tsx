"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { submitTask } from "./taskApi";
import { TTask } from "./types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const statusStyles: Record<TTask["status"], string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function MyTasksClient({ initialTasks }: { initialTasks: TTask[] }) {
  const [tasks, setTasks] = useState<TTask[]>(initialTasks);
  const [resubmitTarget, setResubmitTarget] = useState<string | null>(null);
  const [newLink, setNewLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResubmit = async (jobId: string) => {
    if (!newLink) {
      toast.error("Please provide a new submission link");
      return;
    }
    setIsSubmitting(true);
    try {
      const updated = await submitTask({ jobId, submissionLink: newLink });
      toast.success("Task resubmitted for review");
      setTasks((prev) => prev.map((t) => (t.job.id === jobId ? { ...t, ...updated } : t)));
      setResubmitTarget(null);
      setNewLink("");
    } catch {
      // handled globally
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My Tasks</h1>
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Reward</TableHead>
              <TableHead>Submission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-6 text-gray-500">You haven&apos;t submitted any tasks yet</TableCell></TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.job.title}</TableCell>
                  <TableCell>${task.job.reward}</TableCell>
                  <TableCell>
                    <a href={task.submissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">View link</a>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[task.status]}`}>{task.status}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {task.status === "REJECTED" && (
                      resubmitTarget === task.job.id ? (
                        <div className="flex gap-2 justify-end">
                          <Input placeholder="New submission link" value={newLink} onChange={(e) => setNewLink(e.target.value)} className="w-48" />
                          <Button size="sm" disabled={isSubmitting} onClick={() => handleResubmit(task.job.id)}>
                            {isSubmitting ? "Sending..." : "Resend"}
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setResubmitTarget(task.job.id)}>Resubmit</Button>
                      )
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
