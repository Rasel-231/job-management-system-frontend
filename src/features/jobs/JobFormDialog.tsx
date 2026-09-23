"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createJobAction, updateJobAction } from "./actions";
import { TJob, TJobFormValues, categoryLabels } from "./types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select } from "../../components/ui/select";
import { Dialog } from "../../components/ui/dialog";
import { Icon } from "../../components/ui/icons";
import { cn } from "../../lib/utils";

const emptyForm: TJobFormValues = {
  title: "",
  description: "",
  requirements: "",
  proofRequirements: "",
  reward: 0,
  category: "OTHER",
  deadline: "",
  steps: [],
};

type TJobFormDialogProps = { mode: "create" | "edit"; job?: TJob; onSuccess: (job: TJob) => void };

function SectionLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{children}</p>
      {hint && <span className="text-xs text-muted-foreground/70">{hint}</span>}
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function JobFormDialog({ mode, job, onSuccess }: TJobFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TJobFormValues>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && job && open) {
      setFormData({
        title: job.title,
        description: job.description,
        requirements: job.requirements ?? "",
        proofRequirements: job.proofRequirements,
        reward: job.reward,
        category: job.category,
        deadline: job.deadline ? job.deadline.slice(0, 10) : "",
        steps: (job.steps ?? [])
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((s) => ({ title: s.title, description: s.description ?? "" })),
      });
    }
    if (mode === "create" && open) setFormData(emptyForm);
    if (open) {
      setImageFile(null);
    }
  }, [mode, job, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "reward" ? Number(value) : value }));
  };

  const setStep = (index: number, patch: Partial<TJobFormValues["steps"][number]>) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }));
  };

  const addStep = () => {
    setFormData((prev) => ({ ...prev, steps: [...prev.steps, { title: "", description: "" }] }));
  };

  const removeStep = (index: number) => {
    setFormData((prev) => ({ ...prev, steps: prev.steps.filter((_, i) => i !== index) }));
  };

  const moveStep = (index: number, dir: -1 | 1) => {
    setFormData((prev) => {
      const next = [...prev.steps];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, steps: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedSteps = formData.steps
      .filter((s) => s.title.trim())
      .map((s) => ({ title: s.title.trim(), description: s.description.trim() || undefined }));

    setIsLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "steps") return;
        fd.append(key, String(value));
      });
      fd.append("steps", JSON.stringify(cleanedSteps));
      if (imageFile) fd.append("image", imageFile);

      const result = mode === "create" ? await createJobAction(fd) : await updateJobAction(job!.id, fd);

      toast.success(`Job ${mode === "create" ? "created" : "updated"} successfully`);
      onSuccess(result);
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to ${mode === "create" ? "create" : "update"} job`);
    } finally {
      setIsLoading(false);
    }
  };

  const stepCount = formData.steps.length;

  return (
    <>
      <Button variant={mode === "create" ? "default" : "outline"} size={mode === "edit" ? "sm" : "default"} onClick={() => setOpen(true)}>
        {mode === "create" ? "+ Post New Job" : "Edit"}
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={mode === "create" ? "Post a New Job" : "Edit Job"}
        className="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <SectionLabel>Basics</SectionLabel>
            <Field label="Title" required>
              <Input name="title" value={formData.title} onChange={handleChange} required minLength={3} placeholder="e.g. Design a landing page" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category" required>
                <Select className="w-full" name="category" value={formData.category} onChange={handleChange}>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Deadline">
                <Input type="date" name="deadline" value={formData.deadline} onChange={handleChange} />
              </Field>
            </div>
            <Field label="Reward (৳)" required>
              <Input type="number" name="reward" value={formData.reward} onChange={handleChange} required min={1} step="0.01" placeholder="0.00" />
            </Field>
          </div>

          <div className="space-y-4">
            <SectionLabel>Details</SectionLabel>
            <Field label="Description" required hint={`${formData.description.length} characters`}>
              <Textarea name="description" value={formData.description} onChange={handleChange} required minLength={10} rows={4} placeholder="What needs to be done?" />
            </Field>
            <Field label="Requirements">
              <Textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={2} placeholder="Skills, tools, or eligibility (optional)" />
            </Field>
            <Field label="Proof requirements" required hint="How will completion be verified?">
              <Textarea name="proofRequirements" value={formData.proofRequirements} onChange={handleChange} required rows={2} placeholder="e.g. Screenshot of deployed site + repo link" />
            </Field>
          </div>

          <div className="space-y-3">
            <SectionLabel hint={stepCount > 0 ? `${stepCount} step${stepCount === 1 ? "" : "s"}` : "Optional"}>
              Milestones
            </SectionLabel>
            <p className="text-xs text-muted-foreground">
              Break the job into ordered steps. Participants complete them one by one.
            </p>

            {stepCount === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center">
                <Icon name="checklist" className="mx-auto h-5 w-5 text-muted-foreground/60" />
                <p className="mt-2 text-sm text-muted-foreground">No milestones yet</p>
                <Button type="button" variant="outline" size="sm" className="mt-3" onClick={addStep}>
                  <Icon name="plus" />
                  Add first milestone
                </Button>
              </div>
            ) : (
              <ul className="space-y-3">
                {formData.steps.map((step, i) => (
                  <li
                    key={i}
                    className="group rounded-xl border border-border bg-muted/20 p-3 transition-colors hover:border-muted-foreground/30"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1 space-y-2">
                        <Input
                          value={step.title}
                          onChange={(e) => setStep(i, { title: e.target.value })}
                          placeholder={`Step ${i + 1} title`}
                          required
                          className="h-9 bg-card"
                        />
                        <Textarea
                          value={step.description}
                          onChange={(e) => setStep(i, { description: e.target.value })}
                          placeholder="What happens in this step? (optional)"
                          rows={2}
                          className="bg-card text-sm"
                        />
                      </div>
                      <div className="flex shrink-0 flex-col gap-0.5 opacity-60 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => moveStep(i, -1)}
                          disabled={i === 0}
                          aria-label="Move up"
                          className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                        >
                          <Icon name="chevronUp" className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveStep(i, 1)}
                          disabled={i === stepCount - 1}
                          aria-label="Move down"
                          className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                        >
                          <Icon name="chevronDown" className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeStep(i)}
                          aria-label="Remove milestone"
                          className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Icon name="trash" className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {stepCount > 0 && (
              <Button type="button" variant="outline" size="sm" onClick={addStep} className="w-full border-dashed">
                <Icon name="plus" />
                Add milestone
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <SectionLabel>Attachment</SectionLabel>
            <Field label="Job image" hint={imageFile ? imageFile.name : "Optional — shown on the job card"}>
              <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="file:mr-3 file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs file:font-medium" />
            </Field>
          </div>

          <div className="flex gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className={cn("flex-[2]")} disabled={isLoading} isLoading={isLoading}>
              {isLoading ? "Saving..." : mode === "create" ? "Post job" : "Save changes"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
