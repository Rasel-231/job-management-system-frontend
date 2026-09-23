"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Icon } from "../ui/icons";
import { cn } from "../../lib/utils";

export default function BackButton({ className }: { className?: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={cn("gap-1.5 pl-2 text-muted-foreground", className)}
    >
      <Icon name="chevronLeft" className="h-4 w-4" />
      Back
    </Button>
  );
}