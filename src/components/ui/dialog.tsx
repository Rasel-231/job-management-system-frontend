"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";
import { useModalA11y } from "../../lib/useModalA11y";

type TDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  className?: string;
};

// Framer Motion-animated modal — used for job create/edit forms, etc.
// Portaled to document.body so parent transforms (PageTransition, CSS animations)
// can't trap the fixed overlay or bury it under the navbar's stacking context.
// Accessible: role=dialog + aria-modal, ESC to close, focus trap while open.
export function Dialog({ open, onOpenChange, title, children, className }: TDialogProps) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              "flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-lift",
              className
            )}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id={titleId} className="mb-4 text-lg font-semibold tracking-tight">
              {title}
            </h2>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}