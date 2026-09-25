import { TAccountType, TUserRole, TUserStatus } from "../../types/user";

export type TUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  bio: string | null;
  skillTags: string[];
  role: TUserRole;
  accountType: TAccountType;
  authProvider: "EMAIL" | "GOOGLE" | "FACEBOOK";
  status: TUserStatus;
  isVerified: boolean;
  isPhoneVerified: boolean;
  warnings: number;
};

export type TAuthState = {
  user: TUser | null;
};

export type { TAccountType };