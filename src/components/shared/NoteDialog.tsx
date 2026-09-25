"use client";

import { useEffect, useState } from "react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

type TNoteDialogProps = {
  open: boolean;
  title: string;
  label: string;
  placeholder: string;
  required?: boolean;
  confirmText?: string;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (note: string) => void;
};

// Accessible replacement for the browser prompt() "note" flows in the admin
// review screens. Reuses the Dialog component (dialog semantics + focus trap).
export default function NoteDialog({
  open,
  title,
  label,
  placeholder,
  required = false,
  confirmText = "Confirm",
  isLoading,
  onOpenChange,
  onConfirm,
}: TNoteDialogProps) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) setNote("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title}>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="note-dialog-input" className="text-sm font-medium">
            {label}
          </label>
          <Textarea
            id="note-dialog-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={placeholder}
            rows={3}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" disabled={isLoading} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" disabled={isLoading || (required && !note.trim())} onClick={() => onConfirm(note.trim())}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}