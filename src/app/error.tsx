"use client";

import { useEffect } from "react";
import { Button } from "../components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <p className="text-sm font-medium text-red-400">Error</p>
      <h1 className="text-3xl font-semibold mt-2">Something went wrong</h1>
      <p className="text-gray-500 mt-2 max-w-sm">An unexpected error occurred.</p>
      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={() => reset()}>Try again</Button>
        <Button onClick={() => (window.location.href = "/")}>Go home</Button>
      </div>
    </div>
  );
}
