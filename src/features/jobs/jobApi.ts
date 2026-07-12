import axiosInstance from "../../lib/axiosInstance";
import { TApiResponse } from "../../types/apiResponse";
import { TJob } from "./types";

export const getSingleJob = async (id: string): Promise<TJob> => {
  const res = await axiosInstance.get<TApiResponse<TJob>>(`/jobs/${id}`);
  if (!res.data.data) throw new Error("Job not found");
  return res.data.data;
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
