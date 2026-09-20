"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllUsers, updateUserStatus, updateUserWarning } from "./userApi";
import { TUserRow } from "./types";
import VerifiedBadge from "../../components/shared/VerifiedBadge";
import Pagination from "../../components/shared/Pagination";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Badge, type TBadgeVariant } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const statusBadge: Record<TUserRow["status"], TBadgeVariant> = {
  PENDING: "warning",
  ACTIVE: "success",
  BLOCKED: "destructive",
};

export default function UserApprovalClient({ initialUsers }: { initialUsers: TUserRow[] }) {
  const [users, setUsers] = useState<TUserRow[]>(initialUsers);
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const res = await getAllUsers(
          { status: filter !== "ALL" ? filter : undefined },
          page,
          10
        );
        setUsers(res.data ?? []);
        setTotalPages(res.meta?.totalPages ?? 1);
      } catch {
        // handled globally
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [filter, page]);

  const handleStatusChange = async (id: string, status: "ACTIVE" | "BLOCKED") => {
    setUpdatingId(id);
    try {
      const updated = await updateUserStatus(id, status);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: updated.status } : u)));
      toast.success(`User ${status.toLowerCase()} successfully`);
    } catch {
      // handled globally
    } finally {
      setUpdatingId(null);
    }
  };

  const handleWarning = async (id: string, action: "warn" | "clear") => {
    setUpdatingId(id);
    try {
      const updated = await updateUserWarning(id, action);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, warnings: updated.warnings } : u)));
      toast.success(action === "warn" ? "Warning issued" : "Warnings cleared");
    } catch {
      // handled globally
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Manage users</h1>
        <Select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="w-40"
        >
          <option value="ALL">All Users</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="BLOCKED">Blocked</option>
        </Select>
      </div>

      <div className="card-shadow overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Warnings</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="py-6 text-center text-muted-foreground">Loading...</TableCell></TableRow>
            ) : users.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="py-6 text-center text-muted-foreground">No users found</TableCell></TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <p className="inline-flex items-center gap-1 font-medium">
                      {user.name}
                      {user.isVerified && <VerifiedBadge size={12} />}
                    </p>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-xs">
                    {user.accountType.replace("_", " ")}
                    {user.phone && <span className="block text-muted-foreground">{user.phone}</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadge[user.status]}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={user.warnings > 0 ? "font-semibold text-amber-600" : "text-muted-foreground"}>{user.warnings}</span>
                  </TableCell>
                  <TableCell className="space-x-1 whitespace-nowrap text-right">
                    {user.status !== "ACTIVE" && (
                      <Button size="sm" disabled={updatingId === user.id} onClick={() => handleStatusChange(user.id, "ACTIVE")}>Approve</Button>
                    )}
                    {user.status !== "BLOCKED" && (
                      <Button size="sm" variant="destructive" disabled={updatingId === user.id} onClick={() => handleStatusChange(user.id, "BLOCKED")}>Block</Button>
                    )}
                    {user.status !== "BLOCKED" && user.warnings === 0 && (
                      <Button size="sm" variant="outline" disabled={updatingId === user.id} onClick={() => handleWarning(user.id, "warn")}>Warn</Button>
                    )}
                    {user.warnings > 0 && (
                      <Button size="sm" variant="outline" disabled={updatingId === user.id} onClick={() => handleWarning(user.id, "clear")}>Clear</Button>
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
