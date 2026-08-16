/** Training Ledger design reminder: history is actual evidence—settled, chronological, and protected from plan changes. */
import { Check, ChevronRight, Filter, History as HistoryIcon } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AppShell, EmptyLedger, PageHeading } from "@/components/AppShell";
import { useGym } from "@/contexts/GymContext";
import { toDisplayWeight } from "@/lib/workout-types";

export default function History() {
  const [, navigate] = useLocation(); const { state } = useGym();
  const sessions = state.sessions.filter((session) => session.status === "completed").slice().reverse();
  const volume = (session: typeof sessions[number]) => session.exercises.flatMap((exercise) => exercise.sets).reduce((sum, set) => sum + set.weightGrams * set.reps, 0);
  return <AppShell><PageHeading index="05" eyebrow="History" title="The record, as done." action={<Button variant="outline" disabled><Filter size={16}/> All sessions</Button>} /><p className="page-intro">Completed sessions preserve the work performed—sets, load, and repetitions are never overwritten by later plan changes.</p>
    {sessions.length ? <section className="history-ledger">{sessions.map((session) => <button key={session.id} onClick={() => navigate(`/workout/${session.id}`)} className="history-ledger-row"><span className="set-stamp"><Check size={14}/></span><span className="history-date">{new Date(`${session.date}T12:00:00`).toLocaleDateString("en", { month: "short", day: "numeric" })}</span><span className="history-title"><strong>{session.title}</strong><small>{session.exercises.length} movements · {session.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0)} sets</small></span><span className="history-volume">{volume(session) ? toDisplayWeight(volume(session), state.profile.unitSystem) : "—"}<small>volume</small></span><ChevronRight size={17}/></button>)}</section> : <EmptyLedger title="Your history is clear" body="Completed workouts will collect here as a chronological, protected training record." action={<Button className="ledger-button" onClick={() => navigate("/")}><HistoryIcon size={16}/> Start a workout</Button>} />}
  </AppShell>;
}
