"use client";

import { useEffect } from "react";
import { Button } from "../components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-destructive">Error</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">An unexpected error occurred.</p>
      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={() => reset()}>Try again</Button>
        <Button onClick={() => (window.location.href = "/")}>Go home</Button>
      </div>
    </div>
  );
}