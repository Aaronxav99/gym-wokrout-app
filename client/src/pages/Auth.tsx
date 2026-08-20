/** Training Ledger design reminder: account creation feels like opening a private ledger—restrained, human, and clear about ownership. */
import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

function LedgerMark() {
  return <span aria-hidden="true" className="relative grid size-11 place-items-center border border-primary"><i className="absolute inset-[9px] border border-primary/70"/><b className="absolute -left-1 top-[20px] h-[3px] w-12 bg-primary"/><em className="absolute bottom-2 right-2 size-1.5 bg-primary not-italic"/></span>;
}

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const [location] = useLocation();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const routeSheet = location.startsWith("/history") ? "HISTORY SHEET" : location.startsWith("/progress") ? "PROGRESS SHEET" : location.startsWith("/settings") ? "ACCOUNT FILE" : location.startsWith("/workout") ? "WORKOUT SHEET" : "TRAINING RECORD";

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    const result = mode === "sign-in" ? await signIn(email, password) : await signUp(email, password, displayName || "Athlete");
    setBusy(false);
    if (result.error) setMessage(result.error);
    else if (result.confirmationNeeded) setMessage("Check your email to confirm the account, then return here to sign in.");
  }

  return <main className="min-h-screen bg-background text-foreground grid lg:grid-cols-[1.1fr_.9fr]">
    <section className="relative hidden overflow-hidden border-r border-border bg-card lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_132px,rgba(83,100,87,.13)_133px,transparent_134px)]"/>
      <div className="relative flex items-center gap-3 text-primary"><LedgerMark/><span className="tracking-[.2em] text-xs font-bold">TRAINING<br/><em className="font-serif tracking-normal text-lg">LEDGER</em></span></div>
      <div className="relative max-w-md"><p className="ledger-index">PRIVATE {routeSheet}</p><h1 className="mt-4 font-serif text-6xl leading-[.92]">Your work,<br/>kept yours.</h1><p className="mt-6 max-w-sm text-muted-foreground">Sign in to keep planned sessions, saved sets, and accurate progression attached to your own private record across your devices.</p><div className="mt-10 grid border-y border-border"><div className="grid grid-cols-[2rem_1fr] gap-3 border-b border-border py-3"><span className="text-[10px] font-bold tracking-[.14em] text-primary">01</span><p className="text-xs"><strong className="block tracking-[.12em] text-foreground">PLANNED SESSIONS</strong><span className="text-muted-foreground">Follow the day you intended to train.</span></p></div><div className="grid grid-cols-[2rem_1fr] gap-3 py-3"><span className="text-[10px] font-bold tracking-[.14em] text-primary">02</span><p className="text-xs"><strong className="block tracking-[.12em] text-foreground">SAVED SETS</strong><span className="text-muted-foreground">Keep completed work in your personal history.</span></p></div></div></div>
      <p className="relative text-xs tracking-[.16em] text-muted-foreground">PRIVATE ACCOUNT · PERSONAL LEDGER</p>
    </section>
    <section className="flex min-h-screen items-center justify-center bg-[#f1efe6] p-5 sm:p-10"><div className="w-full max-w-md border border-border bg-card p-6 shadow-sm sm:p-9">
      <div className="mb-8 flex items-center gap-3 text-primary lg:hidden"><LedgerMark/><span className="tracking-[.16em] text-xs font-bold">TRAINING<br/><em className="font-serif tracking-normal text-base">LEDGER</em></span></div>
      <div className="border-b border-border pb-4"><p className="ledger-index">{mode === "sign-in" ? `ACCOUNT ACCESS · ${routeSheet}` : "OPEN A PRIVATE LEDGER"}</p><h2 className="mt-2 font-serif text-4xl">{mode === "sign-in" ? "Welcome back." : "Start your record."}</h2><p className="mt-3 text-sm text-muted-foreground">{mode === "sign-in" ? "Continue recording planned sessions, saved sets, and personal training history." : "This private ledger accepts only email addresses approved by its owner."}</p></div>
      <form className="mt-7 grid gap-4" onSubmit={submit}>{mode === "sign-up" && <label className="field-label">DISPLAY NAME<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="How should the ledger address you?" /></label>}<label className="field-label">EMAIL ADDRESS<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label><label className="field-label">PASSWORD<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" /></label>{message && <p className="border-l-2 border-primary bg-secondary p-3 text-sm">{message}</p>}<button className="ledger-button mt-2 inline-flex items-center justify-center gap-2" disabled={busy} type="submit">{busy ? "Working…" : mode === "sign-in" ? "Sign in to ledger" : "Create private account"}<ArrowRight size={16}/></button></form>
      <p className="mt-6 text-center text-sm text-muted-foreground">{mode === "sign-in" ? "New to Training Ledger?" : "Already have an account?"} <button className="ml-1 font-medium text-primary underline underline-offset-4" type="button" onClick={() => { setMode(mode === "sign-in" ? "sign-up" : "sign-in"); setMessage(""); }}>{mode === "sign-in" ? "Create one" : "Sign in"}</button></p>
    </div></section>
  </main>;
}
