import { redirect } from "next/navigation";

// Kept for legacy deep links — job details now live at the public /jobs/[id] route.
export default async function JobDetailRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/jobs/${id}`);
}