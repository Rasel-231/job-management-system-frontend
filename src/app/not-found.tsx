import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <p className="text-sm font-medium text-gray-400">404</p>
      <h1 className="text-3xl font-semibold mt-2">Page not found</h1>
      <p className="text-gray-500 mt-2 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link href="/" className="mt-6 px-4 py-2 rounded-md bg-black text-white text-sm font-medium">
        Go back home
      </Link>
    </div>
  );
}
