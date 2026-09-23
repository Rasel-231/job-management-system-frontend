"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { deleteJobAction } from "./actions";
import { TJob } from "./types";
import JobFormDialog from "./JobFormDialog";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import Can from "../../components/shared/Can";
import { Permission } from "../../lib/permissions";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import Link from "next/link";

export default function AdminJobsClient({ initialJobs }: { initialJobs: TJob[] }) {
  const [jobs, setJobs] = useState<TJob[]>(initialJobs);
  const [deleteTarget, setDeleteTarget] = useState<TJob | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateSuccess = (job: TJob) => setJobs((prev) => [job, ...prev]);
  const handleEditSuccess = (job: TJob) => setJobs((prev) => prev.map((j) => (j.id === job.id ? job : j)));

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteJobAction(deleteTarget.id);
      setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
      toast.success("Job deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete job");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Manage jobs</h1>
        <Can permission={Permission.JOB_CREATE}>
          <JobFormDialog mode="create" onSuccess={handleCreateSuccess} />
        </Can>
      </div>

      <div className="card-shadow overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Reward</TableHead>
              <TableHead>Posted By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">No jobs posted yet</TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/jobs/${job.id}`} className="transition-colors hover:text-primary hover:underline">{job.title}</Link>
                  </TableCell>
                  <TableCell>৳{job.reward.toLocaleString()}</TableCell>
                  <TableCell>{job.postedBy?.name}</TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Can permission={Permission.JOB_UPDATE}>
                      <JobFormDialog mode="edit" job={job} onSuccess={handleEditSuccess} />
                    </Can>
                    <Can permission={Permission.JOB_DELETE}>
                      <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(job)}>Delete</Button>
                    </Can>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this job?"
        description={`"${deleteTarget?.title}" will be permanently removed. This cannot be undone.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
