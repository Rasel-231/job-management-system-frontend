"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateUserStatusAction, updateUserWarningAction } from "./actions";
import { TUserRow } from "./types";
import UserDetailModal from "./UserDetailModal";
import VerifiedBadge from "../../components/shared/VerifiedBadge";
import Pagination from "../../components/shared/Pagination";
import { usePushToUrl } from "../../lib/useUrlState";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Badge, type TBadgeVariant } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const statusBadge: Record<TUserRow["status"], TBadgeVariant> = {
  PENDING: "warning",
  ACTIVE: "success",
  BLOCKED: "destructive",
};

type TUserApprovalClientProps = {
  initialUsers: TUserRow[];
  initialFilter: string;
  initialPage: number;
  initialTotalPages: number;
};

export default function UserApprovalClient({
  initialUsers,
  initialFilter,
  initialPage,
  initialTotalPages,
}: TUserApprovalClientProps) {
  const [users, setUsers] = useState<TUserRow[]>(initialUsers);
  const [filter, setFilter] = useState(initialFilter);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<TUserRow | null>(null);
  const pushToUrl = usePushToUrl();

  useEffect(() => {
    setUsers(initialUsers);
    setFilter(initialFilter);
    setPage(initialPage);
    setTotalPages(initialTotalPages);
  }, [initialUsers, initialFilter, initialPage, initialTotalPages]);

  const changeFilter = (value: string) => {
    setFilter(value);
    pushToUrl({ filter: value, page: 1 });
  };

  const handleStatusChange = async (id: string, status: "ACTIVE" | "BLOCKED") => {
    setUpdatingId(id);
    try {
      const updated = await updateUserStatusAction(id, status);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: updated.status } : u)));
      setSelectedUser((prev) => (prev && prev.id === id ? { ...prev, status: updated.status } : prev));
      toast.success(`User ${status.toLowerCase()} successfully`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleWarning = async (id: string, action: "warn" | "clear") => {
    setUpdatingId(id);
    try {
      const updated = await updateUserWarningAction(id, action);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, warnings: updated.warnings } : u)));
      setSelectedUser((prev) => (prev && prev.id === id ? { ...prev, warnings: updated.warnings } : prev));
      toast.success(action === "warn" ? "Warning issued" : "Warnings cleared");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update warning");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdated = (updated: TUserRow) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const handleDeleted = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Manage users</h1>
        <Select value={filter} onChange={(e) => changeFilter(e.target.value)} className="w-40">
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
            {users.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="py-6 text-center text-muted-foreground">No users found</TableCell></TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                  onClick={() => setSelectedUser(user)}
                >
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
                  <TableCell className="space-x-1 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
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
        <Pagination page={page} totalPages={totalPages} onPageChange={(p) => pushToUrl({ filter, page: p })} />
      </div>

      <UserDetailModal
        user={selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
        onUpdated={handleUpdated}
        onDeleted={handleDeleted}
      />
    </div>
  );
}