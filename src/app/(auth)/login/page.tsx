import LoginClient from "../../../features/auth/LoginClient";

// SERVER COMPONENT — no client-side interactivity needed here.
// Delegates all form state/Redux/navigation to LoginClient.
export default function LoginPage() {
  return <LoginClient />;
}
