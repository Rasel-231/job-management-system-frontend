"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getCurrentUser } from "../auth/authApi";
import { TUser } from "../auth/types";
import { getMyEarnings } from "../transactions/transactionApi";
import { TEarningsSummary } from "../transactions/types";
import { getMyTasks } from "../tasks/taskApi";
import { TTask } from "../tasks/types";
import { getMyJobs } from "../jobs/jobApi";
import { TJob } from "../jobs/types";
import { Badge, type TBadgeVariant } from "../../components/ui/badge";
import { Icon } from "../../components/ui/icons";

const currency = (n: number) =>
  `৳ ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const taskStatusBadge: Record<string, TBadgeVariant> = {
  PENDING: "outline",
  IN_PROGRESS: "info",
  SUBMITTED: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
};

export default function DashboardOverviewClient() {
  const [user, setUser] = useState<TUser | null>(null);
  const [summary, setSummary] = useState<TEarningsSummary | null>(null);
  const [tasks, setTasks] = useState<TTask[] | null>(null);
  const [jobs, setJobs] = useState<TJob[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const [me, earnings, myTasks, myJobs] = await Promise.allSettled([
          getCurrentUser(),
          getMyEarnings(),
          getMyTasks(),
          getMyJobs(),
        ]);
        if (!mounted) return;
        if (me.status === "fulfilled") setUser(me.value);
        if (earnings.status === "fulfilled") setSummary(earnings.value);
        if (myTasks.status === "fulfilled") setTasks(myTasks.value);
        if (myJobs.status === "fulfilled") setJobs(myJobs.value);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-accent" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-card" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl border border-border bg-card" />
      </div>
    );
  }

  const activeTasks =
    tasks?.filter((t) => t.status === "IN_PROGRESS" || t.status === "SUBMITTED").length ?? 0;
  const openJobs = jobs?.filter((j) => j.status === "OPEN").length ?? 0;

  const cards = [
    {
      label: "Available balance",
      value: summary ? currency(summary.availableBalance) : "—",
      icon: "wallet" as const,
      to: "/dashboard/earnings",
    },
    {
      label: "Total earned",
      value: summary ? currency(summary.totalEarnings) : "—",
      icon: "rupee" as const,
      to: "/dashboard/earnings",
    },
    {
      label: "Active tasks",
      value: String(activeTasks),
      icon: "checklist" as const,
      to: "/dashboard/my-tasks",
    },
    {
      label: "Open jobs",
      value: String(openJobs),
      icon: "briefcase" as const,
      to: "/dashboard/my-jobs",
    },
  ];

  const recentTasks = (tasks ?? []).slice(0, 5);
  const recentTx = (summary?.history ?? []).slice(0, 5);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your jobs today.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card, i) => (
          <Link key={card.label} href={card.to}>
            <motion.div
              className="card-shadow card-shadow-hover rounded-xl border border-border bg-card p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon name={card.icon} className="h-4 w-4" />
              </span>
              <p className="mt-3 text-xs text-muted-foreground">{card.label}</p>
              <p className="mt-0.5 truncate text-lg font-bold tracking-tight">{card.value}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent tasks */}
        <section className="card-shadow rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-semibold tracking-tight">Recent tasks</h2>
            <Link href="/dashboard/my-tasks" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentTasks.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                No tasks yet. Browse the{" "}
                <Link href="/jobs" className="font-medium text-primary hover:underline">
                  job feed
                </Link>{" "}
                to get started.
              </p>
            ) : (
              recentTasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.job.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.progress}% complete • {currency(t.job.reward)}
                    </p>
                  </div>
                  <Badge variant={taskStatusBadge[t.status]}>{t.status}</Badge>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recent transactions */}
        <section className="card-shadow rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-semibold tracking-tight">Recent transactions</h2>
            <Link href="/dashboard/earnings" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentTx.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                No transactions yet. Your earnings will show up here.
              </p>
            ) : (
              recentTx.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{tx.note || tx.type.toLowerCase()}</p>
                    <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-sm font-semibold ${tx.type === "EARNING" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                    {tx.type === "EARNING" ? "+" : "−"}
                    {currency(tx.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* User profile strip */}
      {user && (
        <section className="card-shadow flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          {user.avatarUrl ? (
            <Image src={user.avatarUrl} alt="" width={40} height={40} className="rounded-full border border-border" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">
              {user.name[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">
              {user.isVerified ? "Verified identity" : "Identity not verified yet"}
            </p>
          </div>
          <Link href="/dashboard/profile" className="text-sm font-medium text-primary hover:underline">
            Edit profile
          </Link>
        </section>
      )}
    </div>
  );
}