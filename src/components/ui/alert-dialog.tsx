"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";
import { useModalA11y } from "../../lib/useModalA11y";

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
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => setMounted(true), []);

  useModalA11y(open, close, panelRef);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            ref={panelRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="max-h-[calc(100vh-2rem)] w-full max-w-sm overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-lift"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id={titleId} className="font-semibold tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5">{description}</p>
            <div className="flex justify-end gap-2 mt-5">
              <Button variant="outline" size="sm" disabled={isLoading} onClick={close}>
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