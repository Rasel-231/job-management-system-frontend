"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllVerifications, reviewVerification } from "./verificationApi";
import { TVerification } from "./types";
import Pagination from "../../components/shared/Pagination";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Badge, type TBadgeVariant } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const statusBadge: Record<TVerification["status"], TBadgeVariant> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
};

export default function AdminVerificationsClient() {
  const [requests, setRequests] = useState<TVerification[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async (pageToLoad: number, statusFilter: string) => {
    setIsLoading(true);
    try {
      const res = await getAllVerifications(statusFilter, pageToLoad, 10);
      setRequests(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch {
      // handled globally
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load(page, filter);
  }, [page, filter]);

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
      await reviewVerification(id, status, note ?? undefined);
      toast.success(status === "APPROVED" ? "Verified — user now has the blue badge" : "Verification rejected");
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch {
      // handled globally
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Verification requests</h1>
        <Select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="w-40"
        >
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
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-6 text-gray-500">Loading...</TableCell></TableRow>
            ) : requests.length === 0 ? (
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
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}