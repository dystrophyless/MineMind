import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      const oauthUser = session?.user;
      const isOAuth = oauthUser?.app_metadata?.provider !== "email";
      if (oauthUser && isOAuth) {
        supabase
          .from("user_profiles")
          .select("user_id")
          .eq("user_id", oauthUser.id)
          .maybeSingle()
          .then(({ data: existing }) => {
            if (!existing) {
              const base = (oauthUser.email?.split("@")[0] ?? "player")
                .replace(/[^a-zA-Z0-9_]/g, "_")
                .slice(0, 14);
              const username = `${base}_${oauthUser.id.slice(0, 5)}`;
              supabase.from("user_profiles").insert({
                user_id: oauthUser.id,
                username,
                member_since: new Date().toISOString(),
              });
            }
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
