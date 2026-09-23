"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { socialLoginAction } from "../../features/auth/actions";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../features/auth/authSlice";
import { useRouter } from "next/navigation";
import type { TAccountType } from "../../features/auth/types";

// Includes the script-loaded SDKs (FB SDK is loaded in the auth layout).
// Google uses the local "fake" redirect-less flow: window.google loads the
// client, then we call this helper. If SDKs aren't configured (dev), we
// simulate success via a demo token so the flow stays testable.
export default function SocialLoginButtons({
  accountType,
  redirectBase,
}: {
  accountType: TAccountType;
  redirectBase: (role: string) => string;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<"google" | "facebook" | null>(null);

  const handleGoogle = () => {
    setLoading("google");
    const win = window as unknown as {
      google?: { accounts: { id: { initialize: (c: object) => void; renderButton: (el: Element, o: object) => void; prompt: () => void } } };
    };

    const finish = async (token: string) => {
      try {
        const res = await socialLoginAction("google", token, accountType);
        if (res.ok) {
          dispatch(setUser(res.user));
          toast.success("Logged in with Google");
          router.push(res.user.role === "ADMIN" ? "/admin/jobs" : redirectBase(res.user.role));
        } else {
          toast.error(res.error);
        }
      } catch {
        toast.error("Could not sign in with Google");
      } finally {
        setLoading(null);
      }
    };

    if (win.google?.accounts?.id) {
      win.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: (response: { credential?: string }) => {
          if (response.credential) void finish(response.credential);
          else {
            setLoading(null);
          }
        },
      });
      win.google.accounts.id.renderButton(document.getElementById("google-signin") as HTMLElement, {
        theme: "outline",
        size: "large",
      });
      win.google.accounts.id.prompt();
    } else {
      // Dev fallback — provider not configured.
      toast.info("Google not configured — using demo token");
      void finish("dev_google_token_provides_verification_via_google_tokeninfo");
    }
  };

  const handleFacebook = () => {
    setLoading("facebook");
    const win = window as unknown as {
      FB?: {
        getLoginStatus: (cb: (r: { authResponse?: { accessToken?: string } }) => void) => void;
        login: (cb: (r: { authResponse?: { accessToken?: string } }) => void, opts?: object) => void;
      };
    };

    const finish = async (token: string) => {
      try {
        const res = await socialLoginAction("facebook", token, accountType);
        if (res.ok) {
          dispatch(setUser(res.user));
          toast.success("Logged in with Facebook");
          router.push(res.user.role === "ADMIN" ? "/admin/jobs" : redirectBase(res.user.role));
        } else {
          toast.error(res.error);
        }
      } catch {
        toast.error("Could not sign in with Facebook");
      } finally {
        setLoading(null);
      }
    };

    const onLogin = (response: { authResponse?: { accessToken?: string } }) => {
      if (response.authResponse?.accessToken) {
        void finish(response.authResponse.accessToken);
      } else {
        setLoading(null);
      }
    };

    if (win.FB) {
      win.FB.getLoginStatus((status) => {
        if (status.authResponse?.accessToken) {
          void finish(status.authResponse.accessToken);
        } else {
          win.FB!.login(onLogin, { scope: "public_profile,email" });
        }
      });
    } else {
      // Dev fallback — FB SDK not present.
      toast.info("Facebook SDK not loaded — using demo token");
      void finish("dev_facebook_token_handled_by_graph_api");
    }
  };

  return (
    <div className="w-full space-y-2">
      <button
        id="google-signin"
        type="button"
        onClick={handleGoogle}
        disabled={!!loading}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-input bg-card text-sm font-medium shadow-sm transition-all hover:bg-accent active:scale-[0.99] disabled:opacity-50"
      >
        <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
          <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.1 6.2 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.1 6.2 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29 35.1 26.6 36 24 36c-5.2 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.3 5.3C36.9 37 44 32 44 24c0-1.3-.1-2.6-.4-3.9z" />
        </svg>
        {loading === "google" ? "Signing in..." : "Continue with Google"}
      </button>

      <button
        type="button"
        onClick={handleFacebook}
        disabled={!!loading}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-input bg-card text-sm font-medium shadow-sm transition-all hover:bg-accent active:scale-[0.99] disabled:opacity-50"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
          <path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
        {loading === "facebook" ? "Signing in..." : "Continue with Facebook"}
      </button>
    </div>
  );
}