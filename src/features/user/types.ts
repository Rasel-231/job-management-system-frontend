export type TUserRow = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "PENDING" | "ACTIVE" | "BLOCKED";
  createdAt: string;
};
