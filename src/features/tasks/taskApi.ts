import axiosInstance from "../../lib/axiosInstance";
import { TApiResponse } from "../../types/apiResponse";
import { TAdminTask, TTask } from "./types";

export const applyForJob = async (jobId: string): Promise<TTask> => {
  const res = await axiosInstance.post<TApiResponse<TTask>>("/tasks/apply", { jobId });
  if (!res.data.data) throw new Error("Failed to apply");
  return res.data.data;
};

export const acceptApplication = async (taskId: string): Promise<TTask> => {
  const res = await axiosInstance.post<TApiResponse<TTask>>(`/tasks/${taskId}/accept`);
  if (!res.data.data) throw new Error("Failed to accept application");
  return res.data.data;
};

export const completeStep = async (taskId: string, stepId: string): Promise<TTask> => {
  const res = await axiosInstance.post<TApiResponse<TTask>>(`/tasks/${taskId}/complete-step`, {
    stepId,
  });
  if (!res.data.data) throw new Error("Failed to update step");
  return res.data.data;
};

export const submitProof = async (
  taskId: string,
  payload: { submissionLink?: string; proofNote?: string },
  file?: File
): Promise<TTask> => {
  const formData = new FormData();
  if (payload.submissionLink) formData.append("submissionLink", payload.submissionLink);
  if (payload.proofNote) formData.append("proofNote", payload.proofNote);
  if (file) formData.append("proofFile", file);

  const res = await axiosInstance.post<TApiResponse<TTask>>(`/tasks/${taskId}/submit-proof`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!res.data.data) throw new Error("Failed to submit proof");
  return res.data.data;
};

export const reviewTask = async (
  taskId: string,
  status: "APPROVED" | "REJECTED",
  note?: string
): Promise<TTask> => {
  const res = await axiosInstance.patch<TApiResponse<TTask>>(`/tasks/${taskId}/review`, {
    status,
    note,
  });
  if (!res.data.data) throw new Error("Failed to review task");
  return res.data.data;
};

export const getMyTasks = async (): Promise<TTask[]> => {
  const res = await axiosInstance.get<TApiResponse<TTask[]>>("/tasks/my-tasks");
  return res.data.data ?? [];
};

export const getJobApplications = async (jobId: string): Promise<TTask[]> => {
  const res = await axiosInstance.get<TApiResponse<TTask[]>>(`/tasks/job/${jobId}/applications`);
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