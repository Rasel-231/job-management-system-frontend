"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteJobAction } from "./actions";
import { TJob } from "./types";
import JobFormDialog from "./JobFormDialog";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import Pagination from "../../components/shared/Pagination";
import Can from "../../components/shared/Can";
import { Permission } from "../../lib/permissions";
import { usePushToUrl } from "../../lib/useUrlState";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import Image from "next/image";
import Link from "next/link";

type TAdminJobsClientProps = {
  initialJobs: TJob[];
  initialPage: number;
  initialTotalPages: number;
};

export default function AdminJobsClient({
  initialJobs,
  initialPage,
  initialTotalPages,
}: TAdminJobsClientProps) {
  const [jobs, setJobs] = useState<TJob[]>(initialJobs);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [deleteTarget, setDeleteTarget] = useState<TJob | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pushToUrl = usePushToUrl();

  useEffect(() => {
    setJobs(initialJobs);
    setPage(initialPage);
    setTotalPages(initialTotalPages);
  }, [initialJobs, initialPage, initialTotalPages]);

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
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Reward</TableHead>
              <TableHead>Posted By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">No jobs posted yet</TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    {job.imageUrl ? (
                      <Image src={job.imageUrl} alt={job.title} width={48} height={32} className="h-8 w-12 rounded object-cover" />
                    ) : (
                      <div className="flex h-8 w-12 items-center justify-center rounded border border-dashed border-border text-xs text-muted-foreground">
                        -
                      </div>
                    )}
                  </TableCell>
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
        <Pagination page={page} totalPages={totalPages} onPageChange={(p) => pushToUrl({ page: p })} />
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
