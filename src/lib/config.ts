// Single source of truth for the backend origin so the client (axios),
// server components (serverFetch) and server actions never drift apart.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";