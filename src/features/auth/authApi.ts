import axiosInstance from "../../lib/axiosInstance";
import { TApiResponse } from "../../types/apiResponse";
import { TAccountType, TUser } from "./types";

type TRegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  accountType?: TAccountType;
};
type TLoginPayload = { email: string; password: string };
type TLoginData = { accessToken: string; user: TUser };

export const registerUser = async (payload: TRegisterPayload): Promise<TApiResponse<TLoginData>> => {
  const res = await axiosInstance.post<TApiResponse<TLoginData>>("/auth/register", payload);
  return res.data;
};

export const loginUser = async (payload: TLoginPayload): Promise<TApiResponse<TLoginData>> => {
  const res = await axiosInstance.post<TApiResponse<TLoginData>>("/auth/login", payload);
  return res.data;
};

export const socialLogin = async (
  provider: "google" | "facebook",
  token: string,
  accountType?: TAccountType
): Promise<TApiResponse<TLoginData>> => {
  const res = await axiosInstance.post<TApiResponse<TLoginData>>(`/auth/social/${provider}`, {
    token,
    accountType,
  });
  return res.data;
};

export const logoutUser = async (): Promise<TApiResponse<null>> => {
  const res = await axiosInstance.post<TApiResponse<null>>("/auth/logout");
  return res.data;
};

export const getCurrentUser = async (): Promise<TUser> => {
  const res = await axiosInstance.get<TApiResponse<TUser>>("/auth/me");
  if (!res.data.data) throw new Error("Not authenticated");
  return res.data.data;
};

export const requestOtp = async (phone: string): Promise<{ message: string; devOtp?: string }> => {
  const res = await axiosInstance.post<TApiResponse<{ message: string; devOtp?: string }>>(
    "/auth/otp/request",
    { phone }
  );
  return res.data.data ?? { message: "OTP sent" };
};

export const verifyOtp = async (phone: string, code: string): Promise<TUser> => {
  const res = await axiosInstance.post<TApiResponse<TUser>>("/auth/otp/verify", { phone, code });
  if (!res.data.data) throw new Error("OTP verification failed");
  return res.data.data;
};

export const updateMyProfile = async (payload: {
  name?: string;
  bio?: string;
  skillTags?: string[];
  avatarUrl?: string;
  phone?: string;
  accountType?: TAccountType;
}): Promise<TUser> => {
  const res = await axiosInstance.patch<TApiResponse<TUser>>("/auth/me", payload);
  if (!res.data.data) throw new Error("Failed to update profile");
  return res.data.data;
};