import type { TUser } from "../auth/types";

// Admin list view of a user — same shape as /auth/me plus createdAt. Sharing
// TUser keeps the two user models from drifting apart.
export type TUserRow = TUser & {
  createdAt: string;
};