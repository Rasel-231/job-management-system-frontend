import { TCompactUser } from "../../types/user";

export type TTaskStatus = "PENDING" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "REJECTED";

export type TTaskStep = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  status: "PENDING" | "COMPLETED";
  completedAt: string | null;
};

export type TTask = {
  id: string;
  status: TTaskStatus;
  progress: number;
  submissionLink: string | null;
  proofFileUrl: string | null;
  proofNote: string | null;
  rejectionNote: string | null;
  acceptedAt: string | null;
  submittedAt: string | null;
  approvedAt: string | null;
  createdAt: string;
  user?: TCompactUser & { email: string };
  job: {
    id: string;
    title: string;
    reward: number;
    postedBy: TCompactUser;
  };
  taskSteps: TTaskStep[];
};

export type TAdminTask = TTask & {
  user: TCompactUser & { email: string };
};