export type TUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "PENDING" | "ACTIVE" | "BLOCKED";
  avatarUrl: string | null;
};

export type TAuthState = {
  user: TUser | null;
};
