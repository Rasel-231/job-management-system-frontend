"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createJob, updateJob } from "./jobApi";
import { TJob, TJobFormValues } from "./types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Dialog } from "../../components/ui/dialog";

const emptyForm: TJobFormValues = { title: "", description: "", reward: 0, proofRequirements: "" };

type TJobFormDialogProps = { mode: "create" | "edit"; job?: TJob; onSuccess: (job: TJob) => void };

export default function JobFormDialog({ mode, job, onSuccess }: TJobFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TJobFormValues>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && job) {
      setFormData({
        title: job.title,
        description: job.description,
        reward: job.reward,
        proofRequirements: job.proofRequirements,
      });
    }
  }, [mode, job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "reward" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => fd.append(key, String(value)));
      if (imageFile) fd.append("image", imageFile);

      const result = mode === "create" ? await createJob(fd) : await updateJob(job!.id, fd);

      toast.success(`Job ${mode === "create" ? "created" : "updated"} successfully`);
      onSuccess(result);
      setOpen(false);
      if (mode === "create") setFormData(emptyForm);
    } catch {
      // toast handled globally by axiosInstance
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant={mode === "create" ? "default" : "outline"} size={mode === "edit" ? "sm" : "default"} onClick={() => setOpen(true)}>
        {mode === "create" ? "+ Post New Job" : "Edit"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen} title={mode === "create" ? "Post a New Job" : "Edit Job"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input name="title" value={formData.title} onChange={handleChange} required minLength={3} />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea name="description" value={formData.description} onChange={handleChange} required minLength={10} rows={4} />
          </div>
          <div>
            <label className="text-sm font-medium">Reward ($)</label>
            <Input type="number" name="reward" value={formData.reward} onChange={handleChange} required min={1} step="0.01" />
          </div>
          <div>
            <label className="text-sm font-medium">Proof Requirements</label>
            <Textarea name="proofRequirements" value={formData.proofRequirements} onChange={handleChange} required rows={3} />
          </div>
          <div>
            <label className="text-sm font-medium">Job Image (optional)</label>
            <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Post Job" : "Save Changes"}
          </Button>
        </form>
      </Dialog>
    </>
  );
}
