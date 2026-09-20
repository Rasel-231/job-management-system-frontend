export type TUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  bio: string | null;
  skillTags: string[];
  role: "ADMIN" | "USER";
  accountType: "JOB_SEEKER" | "JOB_POSTER" | "BOTH";
  authProvider: "EMAIL" | "GOOGLE" | "FACEBOOK";
  status: "PENDING" | "ACTIVE" | "BLOCKED";
  isVerified: boolean;
  isPhoneVerified: boolean;
  warnings: number;
};

export type TAuthState = {
  user: TUser | null;
};

export type TAccountType = "JOB_SEEKER" | "JOB_POSTER" | "BOTH";