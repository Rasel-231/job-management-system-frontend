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
  user?: { id: string; name: string; email: string; avatarUrl: string | null; isVerified: boolean };
  job: {
    id: string;
    title: string;
    reward: number;
    postedBy: { id: string; name: string; avatarUrl: string | null; isVerified: boolean };
  };
  taskSteps: TTaskStep[];
};

export type TAdminTask = TTask & {
  user: { id: string; name: string; email: string; avatarUrl: string | null; isVerified: boolean };
};