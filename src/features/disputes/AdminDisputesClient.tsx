"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllDisputes, resolveDispute } from "./disputeApi";
import { TDispute } from "./types";
import Pagination from "../../components/shared/Pagination";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Badge, type TBadgeVariant } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const statusBadge: Record<TDispute["status"], TBadgeVariant> = {
  OPEN: "destructive",
  RESOLVED: "success",
  REJECTED: "secondary",
};

export default function AdminDisputesClient() {
  const [disputes, setDisputes] = useState<TDispute[]>([]);
  const [filter, setFilter] = useState("OPEN");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async (pageToLoad: number, statusFilter: string) => {
    setIsLoading(true);
    try {
      const res = await getAllDisputes(statusFilter, pageToLoad, 10);
      setDisputes(res.data ?? []);
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

  const handleResolve = async (id: string, status: "RESOLVED" | "REJECTED") => {
    setUpdatingId(id);
    const input = status === "RESOLVED" ? prompt("Resolution summary:") : prompt("Rejection note:");
    if (input === null) {
      setUpdatingId(null);
      return;
    }
    const resolution = input.trim() || (status === "RESOLVED" ? "Handled by admin" : "Not a valid claim");
    try {
      await resolveDispute(id, status, resolution);
      toast.success(status === "RESOLVED" ? "Dispute resolved" : "Dispute rejected");
      setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, status, resolution } : d)));
    } catch {
      // handled globally
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dispute desk</h1>
        <Select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="w-40"
        >
          <option value="OPEN">Open</option>
          <option value="RESOLVED">Resolved</option>
          <option value="REJECTED">Rejected</option>
          <option value="ALL">All</option>
        </Select>
      </div>

      <div className="card-shadow overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Initiator</TableHead>
              <TableHead>Against</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="py-6 text-center text-muted-foreground">Loading...</TableCell></TableRow>
            ) : disputes.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="py-6 text-center text-muted-foreground">No disputes found</TableCell></TableRow>
            ) : (
              disputes.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="text-sm">{d.job.title}</TableCell>
                  <TableCell className="text-sm">{d.complainant.name}</TableCell>
                  <TableCell className="text-sm">{d.respondent.name}</TableCell>
                  <TableCell className="max-w-[220px] text-sm">
                    <p className="truncate" title={d.reason}>{d.reason}</p>
                    {d.resolution && <span className="block text-xs text-muted-foreground">{d.resolution}</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadge[d.status]}>{d.status}</Badge>
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    {d.status === "OPEN" && (
                      <>
                        <Button size="sm" disabled={updatingId === d.id} onClick={() => handleResolve(d.id, "RESOLVED")}>Resolve</Button>
                        <Button size="sm" variant="destructive" disabled={updatingId === d.id} onClick={() => handleResolve(d.id, "REJECTED")}>Reject</Button>
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