"use client";

import { useEffect, useState } from "react";
import { getAllTransactions } from "./transactionApi";
import { TTransaction } from "./types";
import Pagination from "../../components/shared/Pagination";
import { Select } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const typeStyles: Record<string, string> = {
  EARNING: "bg-green-100 text-green-700",
  WITHDRAWAL: "bg-blue-100 text-blue-700",
};

export default function AdminTransactionsClient({ initialTransactions }: { initialTransactions: TTransaction[] }) {
  const [transactions, setTransactions] = useState<TTransaction[]>(initialTransactions);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const res = await getAllTransactions(
          typeFilter !== "ALL" ? { type: typeFilter } : undefined,
          page,
          10
        );
        setTransactions(res.data ?? []);
        setTotalPages(res.meta?.totalPages ?? 1);
      } catch {
        // handled globally
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [typeFilter, page]);

  const totalPayout = transactions.filter((t) => t.type === "EARNING").reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">Total paid out (this page): <span className="font-medium">${totalPayout.toFixed(2)}</span></p>
        </div>
        <Select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="w-40">
          <option value="ALL">All Types</option>
          <option value="EARNING">Earnings</option>
          <option value="WITHDRAWAL">Withdrawals</option>
        </Select>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-6 text-gray-500">Loading...</TableCell></TableRow>
            ) : transactions.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-6 text-gray-500">No transactions found</TableCell></TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <div className="font-medium">{tx.user.name}</div>
                    <div className="text-xs text-gray-500">{tx.user.email}</div>
                  </TableCell>
                  <TableCell className="font-medium">${tx.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeStyles[tx.type] || "bg-gray-100 text-gray-700"}`}>{tx.type}</span>
                  </TableCell>
                  <TableCell>{tx.status}</TableCell>
                  <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
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
