export type TUserRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: "ADMIN" | "USER";
  accountType: "JOB_SEEKER" | "JOB_POSTER" | "BOTH";
  authProvider: "EMAIL" | "GOOGLE" | "FACEBOOK";
  status: "PENDING" | "ACTIVE" | "BLOCKED";
  isVerified: boolean;
  isPhoneVerified: boolean;
  warnings: number;
  createdAt: string;
};