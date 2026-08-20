/** Training Ledger design reminder: the entry point is calm, discreet, and built around a private record rather than social fitness noise. */
import { ReactNode } from "react";
import { LockKeyhole } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Auth from "@/pages/Auth";

export function AccountGate({ children }: { children: ReactNode }) {
  const { enabled, loading, user } = useAuth();
  if (loading) return <div className="min-h-screen bg-background text-foreground grid place-items-center p-6"><div className="max-w-sm border border-border bg-card p-8 text-center shadow-sm"><LockKeyhole className="mx-auto mb-4 text-primary" size={28}/><p className="ledger-index">SECURE RECORD</p><h1 className="mt-2 font-serif text-3xl">Opening your ledger.</h1><p className="mt-3 text-sm text-muted-foreground">Checking your account securely.</p></div></div>;
  if (enabled && !user) return <Auth />;
  return <>{children}</>;
}
