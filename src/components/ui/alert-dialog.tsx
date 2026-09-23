"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";

type TAlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isLoading?: boolean;
};

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isLoading,
}: TAlertDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="max-h-[calc(100vh-2rem)] w-full max-w-sm overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-lift"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <h2 className="font-semibold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground mt-1.5">{description}</p>
            <div className="flex justify-end gap-2 mt-5">
              <Button variant="outline" size="sm" disabled={isLoading} onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" disabled={isLoading} onClick={onConfirm}>
                {isLoading ? "Deleting..." : "Confirm"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}