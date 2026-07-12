export type TTask = {
  id: string;
  submissionLink: string;
  proofFileUrl: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  job: { id: string; title: string; reward: number };
};

export type TAdminTask = TTask & {
  user: { id: string; name: string; email: string };
};
