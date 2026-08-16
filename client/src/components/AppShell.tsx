/** Training Ledger design reminder: a left-anchored training sheet with ledger rules, mineral-green confirmation, and one-hand action. */
import { ReactNode } from "react";
import { BarChart3, BookOpenCheck, Dumbbell, History, Home, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useGym } from "@/contexts/GymContext";

const logo = "/manus-storage/training-ledger-mark_a8d47e5e.png";
const navItems = [
  ["/", "Today", Home], ["/plans", "Plan", BookOpenCheck], ["/exercises", "Exercises", Dumbbell],
  ["/history", "History", History], ["/progress", "Progress", BarChart3], ["/settings", "Settings", Settings],
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { connection } = useGym();
  return <div className="ledger-app min-h-screen">
    <aside className="desk-rail" aria-label="Primary navigation">
      <Link href="/" className="brand-lockup"><img src={logo} alt="Training Ledger" /><span>TRAINING<br/><em>LEDGER</em></span></Link>
      <nav>{navItems.map(([href, label, Icon]) => <Link key={href} href={href} className={`rail-link ${location === href ? "is-active" : ""}`}><Icon size={18}/><span>{label}</span></Link>)}</nav>
      <div className="rail-status"><span className={`status-dot ${connection}`}/>{connection === "connected" ? "API connected" : connection === "checking" ? "Checking local API" : "Local workout log"}</div>
    </aside>
    <header className="mobile-header"><Link href="/" className="brand-lockup"><img src={logo} alt="Training Ledger" /><span>TRAINING<br/><em>LEDGER</em></span></Link><Link href="/settings" aria-label="Open settings"><Settings size={21}/></Link></header>
    <main className="ledger-main">
      <div className="ledger-brand-bar" aria-label="Training Ledger personal training record">
        <span className="brand-plate" aria-hidden="true"><i/><b/></span>
        <span className="ledger-wordmark">TRAINING <em>LEDGER</em></span>
        <span className="ledger-origin">PERSONAL TRAINING RECORD</span>
      </div>
      {children}
    </main>
    <nav className="mobile-nav" aria-label="Primary navigation">{navItems.slice(0, 5).map(([href, label, Icon]) => <Link key={href} href={href} className={location === href ? "is-active" : ""}><Icon size={19}/><span>{label}</span></Link>)}</nav>
  </div>;
}

export function PageHeading({ index, eyebrow, title, action }: { index: string; eyebrow: string; title: string; action?: ReactNode }) {
  return <div className="page-heading"><div><p className="ledger-index">{index} / {eyebrow}</p><h1>{title}</h1></div>{action}</div>;
}

export function EmptyLedger({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return <section className="empty-ledger"><div className="ledger-empty-stamp" aria-hidden="true"><span>TL</span><i/></div><h2>{title}</h2><p>{body}</p>{action}</section>;
}
