import type { ReactNode, SVGProps } from "react";

// Minimal stroke icon set — inline SVGs so we avoid an external dependency.

const paths: Record<string, ReactNode> = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </>
  ),
  checklist: (
    <>
      <path d="M9 6h10M9 12h10M9 18h10" />
      <path d="m3 6 1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <path d="M3 10h14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H3" />
      <circle cx="16.5" cy="15" r="0.75" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.2 3.1 7.4 7.5 9.5 4.4-2.1 7.5-5.3 7.5-9.5V6Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3v18M6 21h12" />
      <path d="M5.5 6h13M7 6 3.5 12a3 3 0 0 0 6 0L7 6Zm10 0-3.5 6a3 3 0 0 0 6 0L17 6Z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3.5 20c.5-3.5 2.7-5 5.5-5s5 1.5 5.5 5" />
      <path d="M16 5a3.5 3.5 0 0 1 0 6.5M17 15c2 .5 3.3 2 3.5 5" />
    </>
  ),
  banknote: (
    <>
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 11h0M18 13h0" />
    </>
  ),
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 4v4h4" />
      <path d="M12 8v4l3 2" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </>
  ),
  rupee: (
    <>
      <path d="M6 3h12M6 8h12M6 13 18 3M6 13l6 8M6 3h9a1.5 1.5 0 0 1 0 3H6" />
    </>
  ),
  heart: (
    <>
      <path d="M12 20.5s-7.5-4.7-9.3-9.4C1.4 7.3 3.9 4 7.3 4c2 0 3.7 1.1 4.7 2.8C13 5.1 14.7 4 16.7 4c3.4 0 5.9 3.3 4.6 7.1-1.8 4.7-9.3 9.4-9.3 9.4Z" />
    </>
  ),
  comment: (
    <>
      <path d="M21 12a8 8 0 0 1-8 8H4.8c-.6 0-1-.6-.8-1.2L5 16a8 8 0 1 1 16-4Z" />
      <path d="M8.5 11h0M12.5 11h0M16.5 11h0" />
    </>
  ),
  share: (
    <>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="m8.3 10.8 7.4-3.6M8.3 13.2l7.4 3.6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.7 4.7l1.4 1.4M17.9 17.9l1.4 1.4M2.5 12h2M19.5 12h2M4.7 19.3l1.4-1.4M17.9 6.1l1.4-1.4" />
    </>
  ),
  moon: (
    <>
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M10 11v6M14 11v6" />
      <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </>
  ),
  chevronUp: (
    <>
      <path d="m6 15 6-6 6 6" />
    </>
  ),
  chevronDown: (
    <>
      <path d="m6 9 6 6 6-6" />
    </>
  ),
  chevronLeft: (
    <>
      <path d="m15 6-6 6 6 6" />
    </>
  ),
  grip: (
    <>
      <circle cx="9" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="17" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="17" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  x: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
};

export type TIconName = keyof typeof paths;

export function Icon({
  name,
  className,
  ...props
}: { name: TIconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-4 w-4"}
      aria-hidden
      {...props}
    >
      {paths[name]}
    </svg>
  );
}