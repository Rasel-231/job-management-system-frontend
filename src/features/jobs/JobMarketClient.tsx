"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getFeedJobs, toggleLike, addComment, getComments } from "./jobApi";
import { TJob, TJobComment, categoryLabels } from "./types";
import { useAppSelector } from "../../redux/hooks";
import VerifiedBadge from "../../components/shared/VerifiedBadge";
import JobDetailModal from "./JobDetailModal";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Icon } from "../../components/ui/icons";
import { cn } from "../../lib/utils";

const emptyCategory = "__ALL__";

export default function JobMarketClient() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [jobs, setJobs] = useState<TJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(emptyCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [selectedJob, setSelectedJob] = useState<TJob | null>(null);
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});

  const load = async (pageToLoad: number = 1, reset = false) => {
    setLoading(true);
    try {
      const res = await getFeedJobs({
        searchTerm: searchTerm || undefined,
        category: category !== emptyCategory ? category : undefined,
        page: pageToLoad,
        limit: 10,
      });
      const list = res.data ?? [];
      setJobs((prev) => (reset || pageToLoad === 1 ? list : [...prev, ...list]));
      setHasMore(list.length === 10);
      setPage(pageToLoad);
    } catch {
      // handled globally
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const requireLogin = () => {
    if (user) return true;
    toast.info("Login required");
    router.push("/login");
    return false;
  };

  const handleLike = async (job: TJob) => {
    if (!requireLogin()) return;
    const prev = { liked: job.isLiked, count: job.likeCount };
    setJobs((prevJobs) =>
      prevJobs.map((j) =>
        j.id === job.id
          ? { ...j, isLiked: !prev.liked, likeCount: prev.liked ? prev.count - 1 : prev.count + 1 }
          : j
      )
    );
    try {
      const res = await toggleLike(job.id);
      setJobs((prevJobs) =>
        prevJobs.map((j) => (j.id === job.id ? { ...j, isLiked: res.liked, likeCount: res.likesCount } : j))
      );
    } catch {
      setJobs((prevJobs) =>
        prevJobs.map((j) => (j.id === job.id ? { ...j, isLiked: prev.liked, likeCount: prev.count } : j))
      );
    }
  };

  const handleComment = async (jobId: string) => {
    if (!requireLogin()) return;
    const content = commentInput[jobId]?.trim();
    if (!content) return;
    try {
      const comment = await addComment(jobId, content);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, commentCount: j.commentCount + 1, comments: [...(j.comments ?? []), comment] } : j
        )
      );
      setCommentInput((prev) => ({ ...prev, [jobId]: "" }));
    } catch {
      // handled globally
    }
  };

  const expandComments = async (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job?.comments) return; // already loaded
    try {
      const comments = await getComments(jobId);
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, comments } : j)));
    } catch {
      // handled globally
    }
  };

  const handleShare = async (job: TJob) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/jobs/${job.id}`);
      toast.success("Job link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Search + filter bar */}
      <div className="card-shadow sticky top-16 z-10 flex gap-2 rounded-xl border border-border bg-card p-3">
        <Input
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void load(1, true)}
        />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-48 shrink-0">
          <option value={emptyCategory}>All Categories</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Button variant="secondary" onClick={() => void load(1, true)}>
          Search
        </Button>
      </div>

      {/* Feed cards */}
      {loading && jobs.length === 0 && (
        <div className="animate-grid-fade space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl border border-border bg-card" />
          ))}
        </div>
      )}
      {!loading && jobs.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-card py-14 text-center">
          <p className="font-medium text-foreground">No jobs found</p>
          <p className="mt-1 text-sm text-muted-foreground">Adjust your filters or check back later.</p>
        </div>
      )}

      {jobs.map((job) => (
        <article key={job.id} className="card-shadow card-shadow-hover overflow-hidden rounded-xl border border-border bg-card">
          {/* header */}
          <div className="flex items-center gap-3 p-4">
            <button className="shrink-0" onClick={() => setSelectedJob(job)}>
              {job.postedBy.avatarUrl ? (
                <Image src={job.postedBy.avatarUrl} alt="" width={40} height={40} className="rounded-full" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground">
                  {job.postedBy.name[0]}
                </div>
              )}
            </button>
            <button
              className="flex-1 text-left"
              onClick={() => setSelectedJob(job)}
            >
              <p className="inline-flex items-center gap-1 text-sm font-medium">
                {job.postedBy.name}
                {job.postedBy.isVerified && <VerifiedBadge size={12} />}
              </p>
              <p className="text-xs text-muted-foreground">
                {job.category ? categoryLabels[job.category] : "Job"} •{" "}
                {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ""}
              </p>
            </button>
            <Badge variant={job.status === "OPEN" ? "success" : "warning"}>{job.status}</Badge>
          </div>

          <button className="w-full text-left" onClick={() => setSelectedJob(job)}>
            <h2 className="px-4 text-base font-semibold tracking-tight">{job.title}</h2>
            {job.imageUrl && (
              <div className="relative mt-2 h-60 w-full">
                <Image src={job.imageUrl} alt={job.title} fill className="object-cover" />
              </div>
            )}
            <p className="mt-2 line-clamp-3 px-4 text-sm text-muted-foreground">{job.description}</p>
          </button>

          <div className="mt-3 flex items-center justify-between px-4 text-sm">
            <span className="font-semibold text-foreground">৳ {job.reward.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-xs text-muted-foreground">
              {job.deadline ? `Due ${new Date(job.deadline).toLocaleDateString()}` : "Open-ended"}
            </span>
          </div>

          {/* action bar */}
          <div className="mt-3 flex items-center border-t border-border py-1 text-sm">
            <button
              onClick={() => handleLike(job)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 transition-colors hover:bg-accent",
                job.isLiked ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon name="heart" className="h-4 w-4" />
              <span className="font-medium">{job.likeCount} Like{job.likeCount === 1 ? "" : "s"}</span>
            </button>
            <button
              onClick={() => void expandComments(job.id)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Icon name="comment" className="h-4 w-4" />
              <span className="font-medium">{job.commentCount} Comments</span>
            </button>
            <button
              onClick={() => handleShare(job)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Icon name="share" className="h-4 w-4" />
              <span className="font-medium">Share</span>
            </button>
          </div>

          {/* comments */}
          {job.comments && (
            <div className="space-y-3 border-t border-border bg-muted/30 px-4 py-4">
              {(job.comments as TJobComment[])
                .slice()
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2">
                    <div className="min-w-0 flex-1 rounded-lg bg-card px-3 py-2 shadow-sm">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold">
                        {comment.user.name}
                        {comment.user.isVerified && <VerifiedBadge size={10} />}
                      </span>
                      <p className="text-sm break-words whitespace-pre-line">{comment.content}</p>
                    </div>
                  </div>
                ))}
              {user ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={commentInput[job.id] ?? ""}
                    onChange={(e) => setCommentInput((prev) => ({ ...prev, [job.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && void handleComment(job.id)}
                  />
                  <Button size="sm" variant="secondary" onClick={() => void handleComment(job.id)}>
                    Post
                  </Button>
                </div>
              ) : (
                <button
                  onClick={requireLogin}
                  className="w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Login to join the discussion
                </button>
              )}
            </div>
          )}
        </article>
      ))}

      {hasMore && (
        <Button
          variant="outline"
          className="w-full"
          disabled={loading}
          isLoading={loading}
          onClick={() => void load(page + 1, false)}
        >
          {loading ? "Loading..." : "Load more jobs"}
        </Button>
      )}

      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}