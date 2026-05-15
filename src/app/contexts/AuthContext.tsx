import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  needsOnboarding: boolean;
  completeOnboarding: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const syncAuthState = async (session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);
      setNeedsOnboarding(false);

      const authUser = session?.user;
      if (authUser) {
        const { data: existing, error } = await supabase
          .from("user_profiles")
          .select("user_id")
          .eq("user_id", authUser.id)
          .maybeSingle();

        if (error || !existing) {
          setNeedsOnboarding(true);
        }
      }

      setIsLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncAuthState(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoading(true);
      syncAuthState(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const completeOnboarding = () => {
    setNeedsOnboarding(false);
  };

  const signOut = async () => {
    setNeedsOnboarding(false);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, needsOnboarding, completeOnboarding, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
