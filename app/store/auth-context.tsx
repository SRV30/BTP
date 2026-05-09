import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

type AuthCtx = { token: string | null; userEmail: string | null; loading: boolean; login: (e: string, p: string) => Promise<void>; signup: (e: string, p: string) => Promise<void>; logout: () => void; forgotPassword: (e: string) => Promise<void>; };
const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    api.me(token).then((d) => setUserEmail(d.email)).catch(() => setToken(null));
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try { const data = await api.login(email, password); setToken(data.access_token); } finally { setLoading(false); }
  };

  const signup = async (email: string, password: string) => { await api.signup(email, password); await login(email, password); };
  const logout = () => { setToken(null); setUserEmail(null); };
  const forgotPassword = async (email: string) => { await api.forgotPassword(email); };

  return <AuthContext.Provider value={{ token, userEmail, loading, login, signup, logout, forgotPassword }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext); if (!ctx) throw new Error("useAuth must be within AuthProvider"); return ctx;
};
