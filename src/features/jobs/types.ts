export type TJob = {
  id: string;
  title: string;
  description: string;
  reward: number;
  proofRequirements: string;
  imageUrl: string | null;
  postedBy: { id: string; name: string };
};

export type TJobCartItem = TJob & { addedAt: string };

export type TJobFormValues = {
  title: string;
  description: string;
  reward: number;
  proofRequirements: string;
};
