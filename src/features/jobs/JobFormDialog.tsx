"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createJob, updateJob } from "./jobApi";
import { TJob, TJobFormValues, categoryLabels } from "./types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select } from "../../components/ui/select";
import { Dialog } from "../../components/ui/dialog";

const emptyForm: TJobFormValues = {
  title: "",
  description: "",
  requirements: "",
  proofRequirements: "",
  reward: 0,
  category: "OTHER",
  deadline: "",
  steps: "",
};

const stepsHelp =
  "Bolded milestones that drive each participant's progress bar, e.g. [{\"title\":\"Research\",\"description\":\"Gather data\"},{\"title\":\"Draft\",\"description\":\"Write draft\"}].";

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
        requirements: job.requirements ?? "",
        proofRequirements: job.proofRequirements,
        reward: job.reward,
        category: job.category,
        deadline: job.deadline ? job.deadline.slice(0, 10) : "",
        steps: job.steps
          ? JSON.stringify(
              job.steps
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((s) => ({ title: s.title, description: s.description ?? "" })),
              null,
              2
            )
          : "",
      });
    }
  }, [mode, job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title</label>
            <Input name="title" value={formData.title} onChange={handleChange} required minLength={3} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description</label>
            <Textarea name="description" value={formData.description} onChange={handleChange} required minLength={10} rows={4} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Reward (৳)</label>
              <Input type="number" name="reward" value={formData.reward} onChange={handleChange} required min={1} step="0.01" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Deadline</label>
              <Input type="date" name="deadline" value={formData.deadline} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Category</label>
            <Select className="w-full" name="category" value={formData.category} onChange={handleChange}>
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Requirements</label>
            <Textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={2} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Proof requirements</label>
            <Textarea name="proofRequirements" value={formData.proofRequirements} onChange={handleChange} required rows={2} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Milestones (JSON)</label>
            <Textarea name="steps" value={formData.steps} onChange={handleChange} rows={4} placeholder='[{"title":"Step 1","description":"..."}]' />
            <p className="mt-1 text-xs text-muted-foreground">{stepsHelp}</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Job image (optional)</label>
            <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading} isLoading={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Post job" : "Save changes"}
          </Button>
        </form>
      </Dialog>
    </>
  );
}