"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { reviewVerificationAction } from "./actions";
import { TVerification } from "./types";
import Pagination from "../../components/shared/Pagination";
import { usePushToUrl } from "../../lib/useUrlState";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Badge, type TBadgeVariant } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const statusBadge: Record<TVerification["status"], TBadgeVariant> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
};

// CLIENT COMPONENT — rows/filter/page come from the Server Component
// (searchParams); approval/rejection are Server Actions.
type TAdminVerificationsClientProps = {
  initialRequests: TVerification[];
  initialFilter: string;
  initialPage: number;
  initialTotalPages: number;
};

export default function AdminVerificationsClient({
  initialRequests,
  initialFilter,
  initialPage,
  initialTotalPages,
}: TAdminVerificationsClientProps) {
  const [requests, setRequests] = useState<TVerification[]>(initialRequests);
  const [filter, setFilter] = useState(initialFilter);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const pushToUrl = usePushToUrl();

  useEffect(() => {
    setRequests(initialRequests);
    setFilter(initialFilter);
    setPage(initialPage);
    setTotalPages(initialTotalPages);
  }, [initialRequests, initialFilter, initialPage, initialTotalPages]);

  const changeFilter = (value: string) => {
    setFilter(value);
    pushToUrl({ filter: value, page: 1 });
  };

  const handleReview = async (id: string, status: "APPROVED" | "REJECTED") => {
    setUpdatingId(id);
    let note: string | null = null;
    if (status === "REJECTED") {
      note = prompt("Note to the user (optional):");
      if (note === null) {
        setUpdatingId(null);
        return;
      }
    }
    try {
      await reviewVerificationAction(id, status, note ?? undefined);
      toast.success(status === "APPROVED" ? "Verified — user now has the blue badge" : "Verification rejected");
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to review");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Verification requests</h1>
        <Select value={filter} onChange={(e) => changeFilter(e.target.value)} className="w-40">
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </Select>
      </div>

      <div className="card-shadow overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-6 text-gray-500">No verification requests</TableCell></TableRow>
            ) : (
              requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.user?.name}</div>
                    <div className="text-xs text-gray-500">
                      {r.user?.email}
                      {r.documentNumber && ` • ${r.documentNumber}`}
                    </div>
                  </TableCell>
                  <TableCell>{r.type.replace("_", " ")}</TableCell>
                  <TableCell>
                    <a href={r.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">View document</a>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadge[r.status]}>{r.status}</Badge>
                    {r.adminNote && <span className="text-xs text-gray-500 block mt-1">{r.adminNote}</span>}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {r.status === "PENDING" && (
                      <>
                        <Button size="sm" disabled={updatingId === r.id} onClick={() => handleReview(r.id, "APPROVED")}>Approve</Button>
                        <Button size="sm" variant="destructive" disabled={updatingId === r.id} onClick={() => handleReview(r.id, "REJECTED")}>Reject</Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination page={page} totalPages={totalPages} onPageChange={(p) => pushToUrl({ filter, page: p })} />
      </div>
    </div>
  );
}