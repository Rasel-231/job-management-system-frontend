import { notFound } from "next/navigation";
import Image from "next/image";
import { serverFetch } from "../../../../../lib/serverFetch";
import { TApiResponse } from "../../../../../types/apiResponse";
import { TJob, categoryLabels } from "../../../../../features/jobs/types";
import ApplyButton from "../../../../../components/shared/ApplyButton";
import VerifiedBadge from "../../../../../components/shared/VerifiedBadge";
import { Badge } from "../../../../../components/ui/badge";

// DYNAMIC ROUTE — /dashboard/jobs/[id]. Server-fetches the job detail for
// SEO-friendly rendering, with a client Apply button for the interactive part.
export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let job: TJob | undefined;
  try {
    const res = await serverFetch<TApiResponse<TJob>>(`/jobs/${id}`);
    job = res.data;
  } catch {
    notFound();
  }

  if (!job) notFound();

  return (
    <div className="card-shadow mx-auto max-w-2xl space-y-5 rounded-xl border border-border bg-card p-6">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{categoryLabels[job.category]}</Badge>
          <Badge variant={job.status === "OPEN" ? "success" : "warning"}>{job.status}</Badge>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{job.title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {job.postedBy.avatarUrl ? (
          <Image src={job.postedBy.avatarUrl} alt="" width={36} height={36} className="rounded-full" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground">
            {job.postedBy.name[0]}
          </div>
        )}
        <div>
          <p className="inline-flex items-center gap-1 text-sm font-medium">
            {job.postedBy.name}
            {job.postedBy.isVerified && <VerifiedBadge size={12} />}
          </p>
          {job.deadline && <p className="text-xs text-muted-foreground">Deadline: {new Date(job.deadline).toLocaleDateString()}</p>}
        </div>
        <p className="ml-auto text-xl font-bold">
          ৳ {job.reward.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {job.imageUrl && (
        <div className="relative h-64 w-full overflow-hidden rounded-xl border border-border">
          <Image src={job.imageUrl} alt={job.title} fill className="object-cover" />
        </div>
      )}

      {job.description && (
        <div>
          <h2 className="mb-1 font-medium">Description</h2>
          <p className="whitespace-pre-line text-muted-foreground">{job.description}</p>
        </div>
      )}
      {job.requirements && (
        <div>
          <h2 className="mb-1 font-medium">Requirements</h2>
          <p className="text-sm whitespace-pre-line text-muted-foreground">{job.requirements}</p>
        </div>
      )}
      {job.steps && job.steps.length > 0 && (
        <div>
          <h2 className="mb-1 font-medium">Milestones</h2>
          <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
            {job.steps
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((step) => (
                <li key={step.id}>{step.title}</li>
              ))}
          </ol>
        </div>
      )}
      <div>
        <h2 className="mb-1 font-medium">Proof requirements</h2>
        <p className="text-sm text-muted-foreground">{job.proofRequirements}</p>
      </div>

      <ApplyButton jobId={job.id} />
    </div>
  );
}