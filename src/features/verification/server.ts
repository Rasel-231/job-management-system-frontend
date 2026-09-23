import "server-only";
import { serverFetch } from "../../lib/serverFetch";
import { TApiResponse, TMeta } from "../../types/apiResponse";
import { TVerification } from "./types";

// SERVER-SIDE DATA LOADERS for KYC verification.

export async function getMyVerifications(): Promise<TVerification[]> {
  const res = await serverFetch<TApiResponse<TVerification[]>>("/verifications/my");
  return res.data ?? [];
}

export async function getAllVerifications(
  status?: string,
  page = 1,
  limit = 10
): Promise<{ verifications: TVerification[]; meta?: TMeta }> {
  const res = await serverFetch<TApiResponse<TVerification[]>>("/verifications", {
    params: { status: status && status !== "ALL" ? status : undefined, page, limit },
  });
  return { verifications: res.data ?? [], meta: res.meta };
}