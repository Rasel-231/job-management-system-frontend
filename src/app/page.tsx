import Link from "next/link";

// SERVER COMPONENT — public landing page, no client interactivity needed.
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold">Job Management System</h1>
      <p className="text-gray-500 mt-3 max-w-md">
        Post jobs, complete tasks, and track your earnings — all in one place.
      </p>
      <div className="flex gap-3 mt-6">
        <Link href="/login" className="px-4 py-2 rounded-md bg-black text-white text-sm font-medium">
          Login
        </Link>
        <Link href="/register" className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium">
          Register
        </Link>
      </div>
    </div>
  );
}
