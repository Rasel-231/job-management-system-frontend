import axiosInstance from "../../lib/axiosInstance";
import { TApiResponse } from "../../types/apiResponse";
import { TJob, TJobComment, TJobStep } from "./types";

export const getFeedJobs = async (params?: {
  searchTerm?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<TApiResponse<TJob[]>> => {
  const res = await axiosInstance.get<TApiResponse<TJob[]>>("/jobs", { params });
  return res.data;
};

export const getSingleJob = async (id: string): Promise<TJob> => {
  const res = await axiosInstance.get<TApiResponse<TJob>>(`/jobs/${id}`);
  if (!res.data.data) throw new Error("Job not found");
  return res.data.data;
};

export const getComments = async (jobId: string): Promise<TJobComment[]> => {
  const res = await axiosInstance.get<TApiResponse<TJobComment[]>>(`/jobs/${jobId}/comments`, {
    params: { limit: 50 },
  });
  return res.data.data ?? [];
};

export const toggleLike = async (id: string): Promise<{ liked: boolean; likesCount: number }> => {
  const res = await axiosInstance.post<TApiResponse<{ liked: boolean; likesCount: number }>>(
    `/jobs/${id}/like`
  );
  if (!res.data.data) throw new Error("Failed to like");
  return res.data.data;
};

export const addComment = async (id: string, content: string): Promise<TJobComment> => {
  const res = await axiosInstance.post<TApiResponse<TJobComment>>(`/jobs/${id}/comments`, { content });
  if (!res.data.data) throw new Error("Failed to add comment");
  return res.data.data;
};

export const getMyJobs = async (): Promise<TJob[]> => {
  const res = await axiosInstance.get<TApiResponse<TJob[]>>("/jobs/my-jobs");
  return res.data.data ?? [];
};

// FormData — supports the optional image upload (multer + cloudinary on the backend)
export const createJob = async (formData: FormData): Promise<TJob> => {
  const res = await axiosInstance.post<TApiResponse<TJob>>("/jobs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!res.data.data) throw new Error("Failed to create job");
  return res.data.data;
};

export const updateJob = async (id: string, formData: FormData): Promise<TJob> => {
  const res = await axiosInstance.patch<TApiResponse<TJob>>(`/jobs/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!res.data.data) throw new Error("Failed to update job");
  return res.data.data;
};

export const deleteJob = async (id: string): Promise<TApiResponse<null>> => {
  const res = await axiosInstance.delete<TApiResponse<null>>(`/jobs/${id}`);
  return res.data;
};