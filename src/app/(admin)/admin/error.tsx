"use client";

import { useEffect } from "react";
import { Button } from "../../../components/ui/button";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-xl font-semibold">Couldn&apos;t load this section</h2>
      <p className="text-gray-500 mt-1 text-sm">Please try again.</p>
      <Button className="mt-4" onClick={() => reset()}>Retry</Button>
    </div>
  );
}
