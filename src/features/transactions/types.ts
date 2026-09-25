import { TCompactUser } from "../../types/user";

export type TTransactionType = "EARNING" | "WITHDRAWAL";
export type TWithdrawalMethod = "BKASH" | "NAGAD" | "ROCKET" | "BANK_TRANSFER";
export type TWithdrawalStatus = "PENDING" | "COMPLETED" | "REJECTED";

export const withdrawalMethodLabels: Record<TWithdrawalMethod, string> = {
  BKASH: "Bkash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
  BANK_TRANSFER: "Bank Transfer",
};

export type TTransaction = {
  id: string;
  amount: number;
  type: TTransactionType;
  status: TWithdrawalStatus;
  note: string | null;
  createdAt: string;
  user?: TCompactUser;
};

export type TWithdrawal = {
  id: string;
  amount: number;
  method: TWithdrawalMethod;
  accountHolder: string;
  accountNumber: string;
  status: TWithdrawalStatus;
  adminNote: string | null;
  createdAt: string;
  resolvedAt: string | null;
  user?: TCompactUser;
};

export type TEarningsSummary = {
  totalEarnings: number;
  totalWithdrawn: number;
  availableBalance: number;
  pendingWithdrawals: number;
  history: TTransaction[];
  withdrawals: TWithdrawal[];
};