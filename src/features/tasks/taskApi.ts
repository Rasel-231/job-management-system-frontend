import axiosInstance from "../../lib/axiosInstance";
import { TApiResponse } from "../../types/apiResponse";
import { TAdminTask, TTask } from "./types";

export const submitTask = async (payload: { jobId: string; submissionLink: string }): Promise<TTask> => {
  const res = await axiosInstance.post<TApiResponse<TTask>>("/tasks", payload);
  if (!res.data.data) throw new Error("Failed to submit task");
  return res.data.data;
};

export const getMyTasks = async (): Promise<TTask[]> => {
  const res = await axiosInstance.get<TApiResponse<TTask[]>>("/tasks/my-tasks");
  return res.data.data ?? [];
};

export const getAllTasksAdmin = async (
  status?: string,
  page = 1,
  limit = 10
): Promise<TApiResponse<TAdminTask[]>> => {
  const res = await axiosInstance.get<TApiResponse<TAdminTask[]>>("/tasks", {
    params: { status: status !== "ALL" ? status : undefined, page, limit },
  });
  return res.data;
};

export const updateTaskStatus = async (id: string, status: "APPROVED" | "REJECTED"): Promise<TTask> => {
  const res = await axiosInstance.patch<TApiResponse<TTask>>(`/tasks/${id}/status`, { status });
  if (!res.data.data) throw new Error("Failed to update task");
  return res.data.data;
};
