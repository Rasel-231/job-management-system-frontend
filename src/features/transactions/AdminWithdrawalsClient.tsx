"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllWithdrawals, reviewWithdrawal } from "./transactionApi";
import { TWithdrawal, withdrawalMethodLabels } from "./types";
import Pagination from "../../components/shared/Pagination";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Badge, type TBadgeVariant } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const statusBadge: Record<string, TBadgeVariant> = {
  PENDING: "warning",
  COMPLETED: "success",
  REJECTED: "destructive",
};

export default function AdminWithdrawalsClient() {
  const [withdrawals, setWithdrawals] = useState<TWithdrawal[]>([]);
  const [filter, setFilter] = useState("PENDING");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async (pageToLoad: number, statusFilter: string) => {
    setIsLoading(true);
    try {
      const res = await getAllWithdrawals(statusFilter, pageToLoad, 10);
      setWithdrawals(res.data ?? []);
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

  const handleReview = async (id: string, status: "COMPLETED" | "REJECTED") => {
    setUpdatingId(id);
    let note: string | null = null;
    if (status === "REJECTED") {
      note = prompt("Reason (optional):");
      if (note === null) {
        setUpdatingId(null);
        return;
      }
    }
    try {
      await reviewWithdrawal(id, status, note ?? undefined);
      toast.success(status === "COMPLETED" ? "Withdrawal paid out" : "Withdrawal rejected");
      setWithdrawals((prev) => prev.filter((w) => w.id !== id));
    } catch {
      // handled globally
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Withdrawal requests</h1>
        <Select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="w-40"
        >
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
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">Loading...</TableCell></TableRow>
            ) : withdrawals.length === 0 ? (
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
                        <Button size="sm" disabled={updatingId === w.id} onClick={() => handleReview(w.id, "COMPLETED")}>Mark Paid</Button>
                        <Button size="sm" variant="destructive" disabled={updatingId === w.id} onClick={() => handleReview(w.id, "REJECTED")}>Reject</Button>
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