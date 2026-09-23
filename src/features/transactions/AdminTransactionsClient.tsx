"use client";

import { useEffect, useState } from "react";
import { TTransaction } from "./types";
import Pagination from "../../components/shared/Pagination";
import { usePushToUrl } from "../../lib/useUrlState";
import { Select } from "../../components/ui/select";
import { Badge, type TBadgeVariant } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const typeBadge: Record<string, TBadgeVariant> = {
  EARNING: "success",
  WITHDRAWAL: "info",
};

type TAdminTransactionsClientProps = {
  initialTransactions: TTransaction[];
  initialFilter: string;
  initialPage: number;
  initialTotalPages: number;
};

export default function AdminTransactionsClient({
  initialTransactions,
  initialFilter,
  initialPage,
  initialTotalPages,
}: TAdminTransactionsClientProps) {
  const [transactions, setTransactions] = useState<TTransaction[]>(initialTransactions);
  const [typeFilter, setTypeFilter] = useState(initialFilter);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const pushToUrl = usePushToUrl();

  useEffect(() => {
    setTransactions(initialTransactions);
    setTypeFilter(initialFilter);
    setPage(initialPage);
    setTotalPages(initialTotalPages);
  }, [initialTransactions, initialFilter, initialPage, initialTotalPages]);

  const changeFilter = (value: string) => {
    setTypeFilter(value);
    pushToUrl({ filter: value, page: 1 });
  };

  const totalPayout = transactions.filter((t) => t.type === "EARNING").reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Total paid out (this page): <span className="font-medium text-foreground">৳{totalPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </p>
        </div>
        <Select value={typeFilter} onChange={(e) => changeFilter(e.target.value)} className="w-40">
          <option value="ALL">All Types</option>
          <option value="EARNING">Earnings</option>
          <option value="WITHDRAWAL">Withdrawals</option>
        </Select>
      </div>

      <div className="card-shadow overflow-hidden rounded-xl border border-border bg-card">
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
            {transactions.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="py-6 text-center text-muted-foreground">No transactions found</TableCell></TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <div className="font-medium">{tx.user?.name ?? "User"}</div>
                    <div className="text-xs text-muted-foreground">{tx.user?.email}</div>
                  </TableCell>
                  <TableCell className="font-medium">৳{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    <Badge variant={typeBadge[tx.type] ?? "secondary"}>{tx.type}</Badge>
                  </TableCell>
                  <TableCell>{tx.status}</TableCell>
                  <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination page={page} totalPages={totalPages} onPageChange={(p) => pushToUrl({ filter: typeFilter, page: p })} />
      </div>
    </div>
  );
}