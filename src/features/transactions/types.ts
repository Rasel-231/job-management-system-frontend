export type TTransaction = {
  id: string;
  amount: number;
  type: "EARNING" | "WITHDRAWAL";
  status: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
};

export type TEarningsSummary = {
  totalEarnings: number;
  totalWithdrawn: number;
  availableBalance: number;
  history: TTransaction[];
};
