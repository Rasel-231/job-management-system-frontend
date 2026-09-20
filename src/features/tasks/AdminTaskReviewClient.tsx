"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllTasksAdmin, reviewTask } from "./taskApi";
import { TAdminTask } from "./types";
import Pagination from "../../components/shared/Pagination";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Badge, type TBadgeVariant } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const statusBadge: Record<TAdminTask["status"], TBadgeVariant> = {
  PENDING: "warning",
  IN_PROGRESS: "info",
  SUBMITTED: "secondary",
  APPROVED: "success",
  REJECTED: "destructive",
};

export default function AdminTaskReviewClient() {
  const [tasks, setTasks] = useState<TAdminTask[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const res = await getAllTasksAdmin(filter, page, 10);
        setTasks(res.data ?? []);
        setTotalPages(res.meta?.totalPages ?? 1);
      } catch {
        // handled globally
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [filter, page]);

  const handleDecision = async (id: string, status: "APPROVED" | "REJECTED") => {
    setUpdatingId(id);
    let note: string | null = null;
    if (status === "REJECTED") {
      note = prompt("Rejection note:");
      if (note === null) {
        setUpdatingId(null);
        return;
      }
    }
    try {
      await reviewTask(id, status, note ?? undefined);
      toast.success(status === "APPROVED" ? "Task approved — reward credited" : "Task rejected");
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      // handled globally
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Task review</h1>
        <Select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="w-40"
        >
          <option value="ALL">All Tasks</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </Select>
      </div>

      <div className="card-shadow overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Reward</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">Loading...</TableCell></TableRow>
            ) : tasks.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">No tasks found</TableCell></TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div className="font-medium">{task.user.name}</div>
                    <div className="text-xs text-gray-500">{task.user.email}</div>
                  </TableCell>
                  <TableCell>{task.job.title}</TableCell>
                  <TableCell>৳{task.job.reward.toFixed(2)}</TableCell>
                  <TableCell>{task.progress}%</TableCell>
                  <TableCell>
                    <Badge variant={statusBadge[task.status]}>{task.status.replace("_", " ")}</Badge>
                    <div className="text-xs mt-1 space-x-2">
                      {task.submissionLink && <a href={task.submissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">proof link</a>}
                      {task.proofFileUrl && <a href={task.proofFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">proof file</a>}
                      {task.rejectionNote && <span className="text-red-500">{task.rejectionNote}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {task.status === "SUBMITTED" && (
                      <>
                        <Button size="sm" disabled={updatingId === task.id} onClick={() => handleDecision(task.id, "APPROVED")}>Approve</Button>
                        <Button size="sm" variant="destructive" disabled={updatingId === task.id} onClick={() => handleDecision(task.id, "REJECTED")}>Reject</Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}