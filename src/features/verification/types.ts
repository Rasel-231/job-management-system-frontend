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
  user?: { id: string; name: string; email: string; phone: string | null };
};

export type TAccountSummary = {
  isVerified: boolean;
  isPhoneVerified: boolean;
  phone: string | null;
};