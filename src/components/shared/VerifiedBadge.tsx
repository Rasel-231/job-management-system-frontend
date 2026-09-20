// Blue/green verified tick shown next to a verified user's name.
export default function VerifiedBadge({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Verified"
      className="inline-block shrink-0 text-sky-500"
    >
      <path
        d="M12 2l2.4 2.4 3.4-.5 1.3 3.1 3.1 1.3-.5 3.4L24 14l-2.4 2.4.5 3.4-3.1 1.3-1.3 3.1-3.4-.5L12 26l-2.4-2.4-3.4.5-1.3-3.1-3.1-1.3.5-3.4L0 14l2.4-2.4-.5-3.4 3.1-1.3 1.3-3.1 3.4.5L12 2z"
        transform="scale(0.92)"
        fill="currentColor"
      />
      <path
        d="M10.5 15.6l-2.6-2.6-1.1 1.1 3.7 3.7 6.2-6.2-1.1-1.1z"
        fill="#fff"
        transform="scale(0.92)"
      />
    </svg>
  );
}