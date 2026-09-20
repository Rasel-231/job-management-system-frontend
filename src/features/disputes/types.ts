export type TDisputeStatus = "OPEN" | "RESOLVED" | "REJECTED";

export type TDispute = {
  id: string;
  reason: string;
  status: TDisputeStatus;
  resolution: string | null;
  createdAt: string;
  resolvedAt: string | null;
  job: { id: string; title: string; reward: number };
  task: { id: string; status: string; progress: number } | null;
  complainant: { id: string; name: string; email: string; isVerified: boolean };
  respondent: { id: string; name: string; email: string; isVerified: boolean };
};