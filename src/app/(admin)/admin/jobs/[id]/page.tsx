import { notFound } from "next/navigation";
import Image from "next/image";
import { serverFetch } from "../../../../../lib/serverFetch";
import { TApiResponse } from "../../../../../types/apiResponse";
import { TJob } from "../../../../../features/jobs/types";

// DYNAMIC ROUTE — /admin/jobs/[id]. SERVER COMPONENT: `params` is provided
// by Next.js, data is fetched server-side, and next/navigation's notFound()
// triggers the segment's not-found.tsx (falls back to the nearest ancestor
// since this segment doesn't define its own).
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
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">{job.title}</h1>
      {job.imageUrl && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
          <Image src={job.imageUrl} alt={job.title} fill className="object-cover" />
        </div>
      )}
      <p className="text-gray-700">{job.description}</p>
      <p className="font-medium">Reward: ${job.reward}</p>
      <div>
        <h2 className="font-medium mb-1">Proof Requirements</h2>
        <p className="text-gray-600 text-sm">{job.proofRequirements}</p>
      </div>
      <p className="text-sm text-gray-500">Posted by {job.postedBy?.name}</p>
    </div>
  );
}
