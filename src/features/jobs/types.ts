import { TAccountType, TCompactUser } from "../../types/user";

export type TJobCategory =
  | "WEB_DEVELOPMENT"
  | "GRAPHIC_DESIGN"
  | "CONTENT_WRITING"
  | "DIGITAL_MARKETING"
  | "VIDEO_EDITING"
  | "DATA_ENTRY"
  | "MOBILE_APPS"
  | "SOCIAL_MEDIA"
  | "OTHER";

export type TJobStatus = "OPEN" | "CLOSED";

export const categoryLabels: Record<TJobCategory, string> = {
  WEB_DEVELOPMENT: "Web Development",
  GRAPHIC_DESIGN: "Graphic Design",
  CONTENT_WRITING: "Content Writing",
  DIGITAL_MARKETING: "Digital Marketing",
  VIDEO_EDITING: "Video Editing",
  DATA_ENTRY: "Data Entry",
  MOBILE_APPS: "Mobile Apps",
  SOCIAL_MEDIA: "Social Media",
  OTHER: "Other",
};

export type TJobStep = {
  id: string;
  title: string;
  description: string | null;
  order: number;
};

export type TJobComment = {
  id: string;
  content: string;
  createdAt: string;
  user: TCompactUser;
};

export type TJob = {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  proofRequirements: string;
  reward: number;
  category: TJobCategory;
  deadline: string | null;
  status: TJobStatus;
  imageUrl: string | null;
  likeCount: number;
  commentCount: number;
  taskCount: number;
  stepsCount: number;
  isLiked: boolean;
  postedBy: TCompactUser & { accountType: TAccountType };
  steps?: TJobStep[];
  comments?: TJobComment[];
  createdAt?: string;
};

export type TJobFormStep = {
  title: string;
  description: string;
};

export type TJobFormValues = {
  title: string;
  description: string;
  requirements: string;
  proofRequirements: string;
  reward: number;
  category: string;
  deadline: string;
  steps: TJobFormStep[];
};