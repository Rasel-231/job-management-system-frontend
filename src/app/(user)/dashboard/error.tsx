"use client";

import { useEffect } from "react";
import { Button } from "../../../components/ui/button";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-xl font-semibold tracking-tight">Couldn&apos;t load this section</h2>
      <p className="mt-1 text-sm text-muted-foreground">Please try again.</p>
      <Button className="mt-4" variant="outline" onClick={() => reset()}>Retry</Button>
    </div>
  );
}