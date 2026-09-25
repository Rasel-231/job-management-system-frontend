"use client";

import { useEffect, useState, ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { getCurrentUserAction } from "../features/auth/actions";
import { setUser, logout } from "../features/auth/authSlice";
function AuthRehydrator({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const rehydrate = async () => {
      try {
        const user = await getCurrentUserAction();
        if (user) store.dispatch(setUser(user));
        else store.dispatch(logout());
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
        <div className="h-6 w-6 border-2 border-border border-t-foreground rounded-full animate-spin" />
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
