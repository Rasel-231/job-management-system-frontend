"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { getMyEarnings, requestWithdrawal } from "./transactionApi";
import { TEarningsSummary, TWithdrawalMethod, withdrawalMethodLabels } from "./types";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Badge, type TBadgeVariant } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const currency = (n: number) =>
  `৳ ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const withdrawalStatusBadge: Record<string, TBadgeVariant> = {
  PENDING: "warning",
  COMPLETED: "success",
  REJECTED: "destructive",
};

export default function EarningsClient() {
  const [summary, setSummary] = useState<TEarningsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<TWithdrawalMethod>("BKASH");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      setSummary(await getMyEarnings());
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary) return;
    const num = Number(amount);
    if (!num || num < 50) {
      toast.error("Minimum withdrawal amount is 50");
      return;
    }
    if (num > summary.availableBalance) {
      toast.error(`Insufficient balance — available ${currency(summary.availableBalance)}`);
      return;
    }
    setSubmitting(true);
    try {
      await requestWithdrawal({ amount: num, method, accountHolder, accountNumber });
      toast.success("Withdrawal request submitted! Awaiting admin approval.");
      setAmount("");
      setAccountHolder("");
      setAccountNumber("");
      await load();
    } catch {
      // handled globally
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="py-12 text-center text-muted-foreground">Loading wallet...</p>;
  }

  if (loadError || !summary) {
    return (
      <div className="space-y-3 rounded-xl border border-dashed border-border bg-card py-12 text-center">
        <p className="text-muted-foreground">Could not load your wallet.</p>
        <Button variant="outline" onClick={() => void load()}>
          Retry
        </Button>
      </div>
    );
  }

  const cards = [
    { label: "Total Earnings", value: summary.totalEarnings, color: "text-emerald-600" },
    { label: "Total Withdrawn", value: summary.totalWithdrawn, color: "text-sky-600" },
    { label: "Pending Withdrawals", value: summary.pendingWithdrawals, color: "text-amber-600" },
    { label: "Available Balance", value: summary.availableBalance, color: "text-foreground" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Wallet & Earnings</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            className="card-shadow rounded-xl border border-border bg-card p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
          >
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className={`mt-1 text-xl font-bold ${card.color}`}>{currency(card.value)}</p>
          </motion.div>
        ))}
      </div>

      {/* Withdraw form */}
      <section className="card-shadow space-y-4 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold tracking-tight">Request withdrawal</h2>
        <form onSubmit={handleWithdraw} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              min={50}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Min ৳50"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Method</label>
            <Select className="w-full" value={method} onChange={(e) => setMethod(e.target.value as TWithdrawalMethod)}>
              {Object.entries(withdrawalMethodLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Account Holder Name</label>
            <Input value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Account / Mobile Number</label>
            <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="w-full" disabled={submitting} isLoading={submitting}>
              {submitting ? "Submitting..." : "Request withdrawal"}
            </Button>
          </div>
        </form>
      </section>

      {/* Withdrawals */}
      <section className="card-shadow overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <h2 className="font-semibold tracking-tight">My withdrawals</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summary.withdrawals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">No withdrawals yet</TableCell>
              </TableRow>
            ) : (
              summary.withdrawals.map((w) => (
                <TableRow key={w.id}>
                  <TableCell>{withdrawalMethodLabels[w.method]}</TableCell>
                  <TableCell className="font-medium">{currency(w.amount)}</TableCell>
                  <TableCell>
                    <span className="text-sm">{w.accountHolder}</span>
                    <span className="block text-xs text-muted-foreground">{w.accountNumber}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={withdrawalStatusBadge[w.status]}>{w.status}</Badge>
                    {w.adminNote && <span className="mt-1 block text-xs text-muted-foreground">{w.adminNote}</span>}
                  </TableCell>
                  <TableCell>{new Date(w.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>

      {/* Transaction history */}
      <section className="card-shadow overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <h2 className="font-semibold tracking-tight">Transaction history</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summary.history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">No transactions yet</TableCell>
              </TableRow>
            ) : (
              summary.history.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <Badge variant={tx.type === "EARNING" ? "success" : "warning"}>{tx.type}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{currency(tx.amount)}</TableCell>
                  <TableCell>{tx.status}</TableCell>
                  <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}