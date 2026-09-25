export type TAccountType = "JOB_SEEKER" | "JOB_POSTER" | "BOTH";
export type TUserRole = "ADMIN" | "USER";
export type TUserStatus = "PENDING" | "ACTIVE" | "BLOCKED";

// The public "who said this" shape denormalized onto comments, jobs and tasks.
// Single definition so the verbatim user subsets scattered across features
// can't drift independently.
export type TCompactUser = {
  id: string;
  name: string;
  avatarUrl: string | null;
  isVerified?: boolean;
  email?: string;
  phone?: string | null;
  accountType?: TAccountType;
};