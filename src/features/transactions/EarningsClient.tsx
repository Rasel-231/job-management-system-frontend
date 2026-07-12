"use client";

import { motion } from "framer-motion";
import { TEarningsSummary } from "./types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

export default function EarningsClient({ summary }: { summary: TEarningsSummary }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Earnings Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Earnings", value: summary.totalEarnings, color: "text-green-600" },
          { label: "Total Withdrawn", value: summary.totalWithdrawn, color: "text-blue-600" },
          { label: "Available Balance", value: summary.availableBalance, color: "text-gray-900" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            className="border rounded-lg p-4 bg-white"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className={`text-2xl font-semibold ${card.color}`}>${card.value.toFixed(2)}</p>
          </motion.div>
        ))}
      </div>

      <div className="border rounded-lg bg-white">
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
              <TableRow><TableCell colSpan={4} className="text-center py-6 text-gray-500">No transaction history yet</TableCell></TableRow>
            ) : (
              summary.history.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell>${tx.amount.toFixed(2)}</TableCell>
                  <TableCell>{tx.status}</TableCell>
                  <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
