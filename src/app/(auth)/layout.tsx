import PageTransition from "../../components/shared/PageTransition";

// (auth) route group layout — Server Component. Just centers the auth
// forms and applies the shared page transition; no auth logic here since
// proxy.ts already keeps authenticated users off /login and /register.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
