import { notFound } from "next/navigation";
import Image from "next/image";
import { serverFetch } from "../../../../../lib/serverFetch";
import { TApiResponse } from "../../../../../types/apiResponse";
import { TJob } from "../../../../../features/jobs/types";
import { Badge } from "../../../../../components/ui/badge";

// DYNAMIC ROUTE — /admin/jobs/[id]. SERVER COMPONENT: `params` is provided
// by Next.js, data is fetched server-side, and next/navigation's notFound()
// triggers the segment's not-found.tsx.
export default async function AdminJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
        <Badge variant={job.status === "OPEN" ? "success" : "warning"}>{job.status}</Badge>
      </div>
      {job.imageUrl && (
        <div className="relative h-64 w-full overflow-hidden rounded-xl border border-border">
          <Image src={job.imageUrl} alt={job.title} fill className="object-cover" />
        </div>
      )}
      <p className="text-muted-foreground">{job.description}</p>
      <p className="font-medium">
        Reward: ৳{job.reward.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <div>
        <h2 className="mb-1 font-medium">Proof requirements</h2>
        <p className="text-sm text-muted-foreground">{job.proofRequirements}</p>
      </div>
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
      <p className="text-sm text-muted-foreground">
        Posted by <span className="font-medium text-foreground">{job.postedBy?.name}</span>
      </p>
    </div>
  );
}