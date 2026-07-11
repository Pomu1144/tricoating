import { useCallback, useEffect, useState } from "react";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

const EVENT = "tc-auth-change";

export function notifyAuthChange() {
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = (await res.json()) as { user: AuthUser };
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const sync = () => void refresh();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, [refresh]);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    notifyAuthChange();
  }, []);

  return { user, loading, refresh, signOut };
}
