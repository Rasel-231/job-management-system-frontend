"use client";

import { AlertDialog } from "../ui/alert-dialog";

type TConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isLoading?: boolean;
};

export default function ConfirmDialog(props: TConfirmDialogProps) {
  return <AlertDialog {...props} />;
}
