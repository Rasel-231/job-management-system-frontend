import { TCompactUser } from "../../types/user";

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
  complainant: TCompactUser & { email: string };
  respondent: TCompactUser & { email: string };
};