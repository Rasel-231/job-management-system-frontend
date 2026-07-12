"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllUsers, updateUserStatus } from "./userApi";
import { TUserRow } from "./types";
import Pagination from "../../components/shared/Pagination";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const statusStyles: Record<TUserRow["status"], string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ACTIVE: "bg-green-100 text-green-700",
  BLOCKED: "bg-red-100 text-red-700",
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
        const res = await getAllUsers(filter, page, 10);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">User Approval</h1>
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

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">Loading...</TableCell></TableRow>
            ) : users.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">No users found</TableCell></TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[user.status]}`}>{user.status}</span>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {user.status !== "ACTIVE" && (
                      <Button size="sm" disabled={updatingId === user.id} onClick={() => handleStatusChange(user.id, "ACTIVE")}>Approve</Button>
                    )}
                    {user.status !== "BLOCKED" && (
                      <Button size="sm" variant="destructive" disabled={updatingId === user.id} onClick={() => handleStatusChange(user.id, "BLOCKED")}>Block</Button>
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
