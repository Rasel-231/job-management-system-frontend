import axiosInstance from "../../lib/axiosInstance";
import { TApiResponse } from "../../types/apiResponse";
import { TUser } from "./types";

type TRegisterPayload = { name: string; email: string; password: string };
type TLoginPayload = { email: string; password: string };
type TLoginData = { accessToken: string; user: TUser };

export const registerUser = async (payload: TRegisterPayload): Promise<TApiResponse<TUser>> => {
  const res = await axiosInstance.post<TApiResponse<TUser>>("/auth/register", payload);
  return res.data;
};

export const loginUser = async (payload: TLoginPayload): Promise<TApiResponse<TLoginData>> => {
  const res = await axiosInstance.post<TApiResponse<TLoginData>>("/auth/login", payload);
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
