import type { Metadata } from "next";
import "../styles/globals.css";
import ReduxProvider from "../redux/provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: {
    default: "JobStack — Milestone-based freelancing",
    template: "%s · JobStack",
  },
  description:
    "Post jobs with proof-based milestones, complete tasks phase by phase, and withdraw earnings straight to your wallet.",
};

// ROOT LAYOUT — Server Component. Wraps the whole app in the Redux provider
// (which itself is a Client Component boundary) and the toast container.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </ReduxProvider>
      </body>
    </html>
  );
}
