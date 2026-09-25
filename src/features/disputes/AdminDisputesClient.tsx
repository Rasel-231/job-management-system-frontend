"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { resolveDisputeAction } from "./actions";
import { TDispute } from "./types";
import Pagination from "../../components/shared/Pagination";
import NoteDialog from "../../components/shared/NoteDialog";
import { usePushToUrl } from "../../lib/useUrlState";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Badge, type TBadgeVariant } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const statusBadge: Record<TDispute["status"], TBadgeVariant> = {
  OPEN: "destructive",
  RESOLVED: "success",
  REJECTED: "secondary",
};

type TAdminDisputesClientProps = {
  initialDisputes: TDispute[];
  initialFilter: string;
  initialPage: number;
  initialTotalPages: number;
};

export default function AdminDisputesClient({
  initialDisputes,
  initialFilter,
  initialPage,
  initialTotalPages,
}: TAdminDisputesClientProps) {
  const [disputes, setDisputes] = useState<TDispute[]>(initialDisputes);
  const [filter, setFilter] = useState(initialFilter);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [resolveTarget, setResolveTarget] = useState<{ dispute: TDispute; status: "RESOLVED" | "REJECTED" } | null>(null);
  const pushToUrl = usePushToUrl();

  useEffect(() => {
    setDisputes(initialDisputes);
    setFilter(initialFilter);
    setPage(initialPage);
    setTotalPages(initialTotalPages);
  }, [initialDisputes, initialFilter, initialPage, initialTotalPages]);

  const changeFilter = (value: string) => {
    setFilter(value);
    pushToUrl({ filter: value, page: 1 });
  };

  const handleResolve = async (id: string, status: "RESOLVED" | "REJECTED", note: string) => {
    setUpdatingId(id);
    const resolution = note.trim() || (status === "RESOLVED" ? "Handled by admin" : "Not a valid claim");
    try {
      await resolveDisputeAction(id, status, resolution);
      toast.success(status === "RESOLVED" ? "Dispute resolved" : "Dispute rejected");
      setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, status, resolution } : d)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to resolve dispute");
    } finally {
      setUpdatingId(null);
    }
  };

  const requestResolve = (dispute: TDispute, status: "RESOLVED" | "REJECTED") => {
    setResolveTarget({ dispute, status });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dispute desk</h1>
        <Select value={filter} onChange={(e) => changeFilter(e.target.value)} className="w-40">
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
            {disputes.length === 0 ? (
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
                        <Button size="sm" disabled={updatingId === d.id} onClick={() => requestResolve(d, "RESOLVED")}>Resolve</Button>
                        <Button size="sm" variant="destructive" disabled={updatingId === d.id} onClick={() => requestResolve(d, "REJECTED")}>Reject</Button>
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
        open={!!resolveTarget}
        onOpenChange={(open) => !open && setResolveTarget(null)}
        title={resolveTarget?.status === "RESOLVED" ? "Resolve dispute" : "Reject dispute"}
        label={resolveTarget?.status === "RESOLVED" ? "Resolution summary" : "Rejection note"}
        placeholder={resolveTarget?.status === "RESOLVED" ? "How was this dispute settled?" : "Why does this claim not hold?"}
        confirmText={resolveTarget?.status === "RESOLVED" ? "Resolve" : "Reject"}
        isLoading={updatingId === resolveTarget?.dispute.id}
        onConfirm={(note) => {
          if (!resolveTarget) return;
          const { dispute, status } = resolveTarget;
          setResolveTarget(null);
          void handleResolve(dispute.id, status, note);
        }}
      />
    </div>
  );
}