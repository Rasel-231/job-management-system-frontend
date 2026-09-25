"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { reviewWithdrawalAction } from "./actions";
import { TWithdrawal, withdrawalMethodLabels } from "./types";
import Pagination from "../../components/shared/Pagination";
import NoteDialog from "../../components/shared/NoteDialog";
import { usePushToUrl } from "../../lib/useUrlState";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Badge, type TBadgeVariant } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const statusBadge: Record<string, TBadgeVariant> = {
  PENDING: "warning",
  COMPLETED: "success",
  REJECTED: "destructive",
};

type TAdminWithdrawalsClientProps = {
  initialWithdrawals: TWithdrawal[];
  initialFilter: string;
  initialPage: number;
  initialTotalPages: number;
};

export default function AdminWithdrawalsClient({
  initialWithdrawals,
  initialFilter,
  initialPage,
  initialTotalPages,
}: TAdminWithdrawalsClientProps) {
  const [withdrawals, setWithdrawals] = useState<TWithdrawal[]>(initialWithdrawals);
  const [filter, setFilter] = useState(initialFilter);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<TWithdrawal | null>(null);
  const pushToUrl = usePushToUrl();

  useEffect(() => {
    setWithdrawals(initialWithdrawals);
    setFilter(initialFilter);
    setPage(initialPage);
    setTotalPages(initialTotalPages);
  }, [initialWithdrawals, initialFilter, initialPage, initialTotalPages]);

  const changeFilter = (value: string) => {
    setFilter(value);
    pushToUrl({ filter: value, page: 1 });
  };

  const handleReview = async (id: string, status: "COMPLETED" | "REJECTED", note?: string) => {
    setUpdatingId(id);
    try {
      await reviewWithdrawalAction(id, status, note);
      toast.success(status === "COMPLETED" ? "Withdrawal paid out" : "Withdrawal rejected");
      setWithdrawals((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to review withdrawal");
    } finally {
      setUpdatingId(null);
    }
  };

  const requestReview = (w: TWithdrawal, status: "COMPLETED" | "REJECTED") => {
    if (status === "REJECTED") setRejectTarget(w);
    else void handleReview(w.id, status);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Withdrawal requests</h1>
        <Select value={filter} onChange={(e) => changeFilter(e.target.value)} className="w-40">
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
          <option value="ALL">All</option>
        </Select>
      </div>

      <div className="card-shadow overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">No withdrawals found</TableCell></TableRow>
            ) : (
              withdrawals.map((w) => (
                <TableRow key={w.id}>
                  <TableCell>
                    <div className="font-medium">{w.user?.name}</div>
                    <div className="text-xs text-gray-500">{w.user?.email} {w.user?.phone}</div>
                  </TableCell>
                  <TableCell>{withdrawalMethodLabels[w.method]}</TableCell>
                  <TableCell>৳{w.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className="text-sm">{w.accountHolder}</span>
                    <span className="text-xs text-gray-500 block">{w.accountNumber}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadge[w.status]}>{w.status}</Badge>
                    {w.adminNote && <span className="text-xs text-gray-500 block mt-1">{w.adminNote}</span>}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {w.status === "PENDING" && (
                      <>
                        <Button size="sm" disabled={updatingId === w.id} onClick={() => requestReview(w, "COMPLETED")}>Mark Paid</Button>
                        <Button size="sm" variant="destructive" disabled={updatingId === w.id} onClick={() => requestReview(w, "REJECTED")}>Reject</Button>
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

      <NoteDialog
        open={!!rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        title="Reject withdrawal"
        label="Reason (optional)"
        placeholder="Why was this withdrawal rejected?"
        confirmText="Reject"
        isLoading={updatingId === rejectTarget?.id}
        onConfirm={(note) => {
          if (!rejectTarget) return;
          const { id } = rejectTarget;
          setRejectTarget(null);
          void handleReview(id, "REJECTED", note || undefined);
        }}
      />
    </div>
  );
}