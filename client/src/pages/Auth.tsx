/** Training Ledger design reminder: account creation feels like opening a private ledger—restrained, human, and clear about ownership. */
import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole, NotebookPen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    const result = mode === "sign-in" ? await signIn(email, password) : await signUp(email, password, displayName || "Athlete");
    setBusy(false);
    if (result.error) setMessage(result.error);
    else if (result.confirmationNeeded) setMessage("Check your email to confirm the account, then return here to sign in.");
  }

  return <main className="min-h-screen bg-background text-foreground grid lg:grid-cols-[1.1fr_.9fr]">
    <section className="hidden lg:flex flex-col justify-between border-r border-border bg-card p-12">
      <div className="flex items-center gap-3 text-primary"><span className="grid size-11 place-items-center border border-primary"><NotebookPen size={22}/></span><span className="tracking-[.2em] text-xs font-bold">TRAINING<br/><em className="font-serif tracking-normal text-lg">LEDGER</em></span></div>
      <div className="max-w-md"><p className="ledger-index">PRIVATE TRAINING RECORD</p><h1 className="mt-4 font-serif text-6xl leading-[.92]">Your work,<br/>kept yours.</h1><p className="mt-6 max-w-sm text-muted-foreground">Sign in to keep sessions, plans, and progress attached to your own private account across your devices.</p></div>
      <p className="text-xs tracking-[.16em] text-muted-foreground">ONE ACCOUNT · ONE PERSONAL LEDGER</p>
    </section>
    <section className="flex min-h-screen items-center justify-center p-5 sm:p-10"><div className="w-full max-w-md border border-border bg-card p-6 shadow-sm sm:p-9">
      <div className="mb-8 lg:hidden flex items-center gap-3 text-primary"><LockKeyhole size={22}/><span className="tracking-[.16em] text-xs font-bold">TRAINING LEDGER</span></div>
      <p className="ledger-index">{mode === "sign-in" ? "ACCOUNT ACCESS" : "OPEN A PRIVATE LEDGER"}</p><h2 className="mt-2 font-serif text-4xl">{mode === "sign-in" ? "Welcome back." : "Start your record."}</h2><p className="mt-3 text-sm text-muted-foreground">{mode === "sign-in" ? "Your training data remains private to this account." : "Create a personal account for secure cloud sync."}</p>
      <form className="mt-7 grid gap-4" onSubmit={submit}>{mode === "sign-up" && <label className="field-label">DISPLAY NAME<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="How should the ledger address you?" /></label>}<label className="field-label">EMAIL ADDRESS<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label><label className="field-label">PASSWORD<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" /></label>{message && <p className="border-l-2 border-primary bg-secondary p-3 text-sm">{message}</p>}<button className="ledger-button mt-2 inline-flex items-center justify-center gap-2" disabled={busy} type="submit">{busy ? "Working…" : mode === "sign-in" ? "Sign in to ledger" : "Create private account"}<ArrowRight size={16}/></button></form>
      <p className="mt-6 text-center text-sm text-muted-foreground">{mode === "sign-in" ? "New to Training Ledger?" : "Already have an account?"} <button className="ml-1 font-medium text-primary underline underline-offset-4" type="button" onClick={() => { setMode(mode === "sign-in" ? "sign-up" : "sign-in"); setMessage(""); }}>{mode === "sign-in" ? "Create one" : "Sign in"}</button></p>
    </div></section>
  </main>;
}
