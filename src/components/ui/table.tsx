import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const Table = ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
  <table className={cn("w-full text-sm", className)} {...props} />
);

export const TableHeader = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn("bg-gray-50", className)} {...props} />
);

export const TableBody = (props: HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />;

export const TableRow = ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn("border-b last:border-0", className)} {...props} />
);

export const TableHead = ({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn("px-4 py-3 text-left font-medium text-gray-500", className)} {...props} />
);

export const TableCell = ({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("px-4 py-3", className)} {...props} />
);
