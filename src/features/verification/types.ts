import { TCompactUser } from "../../types/user";

export type TVerification = {
  id: string;
  userId: string;
  type: "NID" | "BIRTH_CERTIFICATE";
  documentUrl: string;
  documentNumber: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
  user?: TCompactUser;
};