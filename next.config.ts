import type { NextConfig } from "next";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
let apiOrigin = "";
try {
  apiOrigin = new URL(apiBase).origin;
} catch {
  apiOrigin = "";
}

const connectSources = ["'self'"];
if (apiOrigin) connectSources.push(apiOrigin);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            // script-src allows the inline theme script (layout.tsx) via its
            // sha256 hash — no 'unsafe-inline' for scripts. Plus the social
            // login SDKs loaded dynamically.
            value: [
              "default-src 'self'",
              "script-src 'self' 'sha256-78e973e340fe7f1ce3403caa4a9afee7cb62d2fbda18a8e6a8bce0a9623728c2' https://accounts.google.com https://apis.google.com https://connect.facebook.net",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https://res.cloudinary.com https://www.google.com https://www.facebook.com",
              "font-src 'self' data:",
              `connect-src ${connectSources.join(" ")}`,
              "frame-src https://accounts.google.com https://staticxx.facebook.com https://www.facebook.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;