"use client";

import { useEffect, type RefObject } from "react";

// Accessible modal behavior shared by Dialog and AlertDialog: ESC to close,
// focus trap while open, focus restore to the previously-focused element on
// close. `containerRef` should point at the inner dialog panel.
export function useModalA11y(
  open: boolean,
  onClose: () => void,
  containerRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;
    const lastFocused = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      );

    const first = focusables()[0];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const active = document.activeElement;
      if (e.shiftKey && active === list[0]) {
        e.preventDefault();
        list[list.length - 1].focus();
      } else if (!e.shiftKey && active === list[list.length - 1]) {
        e.preventDefault();
        list[0].focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      lastFocused?.focus?.();
    };
  }, [open, onClose, containerRef]);
}