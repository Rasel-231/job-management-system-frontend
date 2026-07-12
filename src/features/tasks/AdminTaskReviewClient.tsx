"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllTasksAdmin, updateTaskStatus } from "./taskApi";
import { TAdminTask } from "./types";
import Pagination from "../../components/shared/Pagination";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const statusStyles: Record<TAdminTask["status"], string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function AdminTaskReviewClient({ initialTasks }: { initialTasks: TAdminTask[] }) {
  const [tasks, setTasks] = useState<TAdminTask[]>(initialTasks);
  const [filter, setFilter] = useState("PENDING");
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
    try {
      await updateTaskStatus(id, status);
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
        <h1 className="text-2xl font-semibold">Task Review</h1>
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
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </Select>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Reward</TableHead>
              <TableHead>Submission</TableHead>
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
                  <TableCell>${task.job.reward}</TableCell>
                  <TableCell>
                    <a href={task.submissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">View link</a>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[task.status]}`}>{task.status}</span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {task.status === "PENDING" && (
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
