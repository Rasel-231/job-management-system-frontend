"use client";

import { useEffect, useState, ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { getCurrentUser } from "../features/auth/authApi";
import { setUser, logout } from "../features/auth/authSlice";

// Rehydrates Redux auth state from the httpOnly accessToken cookie on
// every fresh page load (Redux state itself doesn't survive a refresh).
function AuthRehydrator({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const rehydrate = async () => {
      try {
        const user = await getCurrentUser();
        store.dispatch(setUser(user));
      } catch {
        store.dispatch(logout());
      } finally {
        setIsReady(true);
      }
    };
    rehydrate();
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-6 w-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthRehydrator>{children}</AuthRehydrator>
    </Provider>
  );
}
