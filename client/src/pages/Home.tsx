/** Training Ledger design reminder: today’s training is a left-anchored record sheet—direct, calm, and action-first. */
import { ArrowRight, CalendarDays, Check, ChevronRight, Clock3, Play, Scale, Sparkles } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AppShell, EmptyLedger, PageHeading } from "@/components/AppShell";
import { dayLabel, toDisplayWeight } from "@/lib/workout-types";
import { useGym } from "@/contexts/GymContext";

const localToday = () => { const now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); return now.toISOString().slice(0, 10); };
function formatDate(date: string) { return new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date(`${date}T12:00:00`)); }

export default function Home() {
  const [, navigate] = useLocation();
  const { state, startWorkout } = useGym();
  const [workoutDate, setWorkoutDate] = useState(localToday);
  const weekday = (new Date(`${workoutDate}T12:00:00`).getDay() + 6) % 7;
  const activePlan = state.plans[0];
  const todayPlan = activePlan?.days.find((day) => day.scheduledDay === weekday);
  const latestWeight = state.bodyWeight.at(-1);
  const completed = state.sessions.filter((session) => session.status === "completed");
  const recent = completed.slice(-3).reverse();
  const start = async () => { const session = await startWorkout(todayPlan, workoutDate); navigate(`/workout/${session.id}`); };

  return <AppShell>
    <PageHeading index="01" eyebrow="Today" title={formatDate(workoutDate)} />
    <section className="today-sheet">
      <div className="today-sheet-copy">
        <p className="ink-label">{todayPlan ? `${dayLabel(todayPlan.scheduledDay)} / Scheduled session` : "Open training window"}</p>
        <h2>{todayPlan?.name ?? "Make today’s record."}</h2>
        <p>{todayPlan ? `${todayPlan.exercises.length} movements planned · ${todayPlan.splitName || "Training day"}` : "Start a quick workout now, or build a repeatable week inside your plan."}</p>
        <label className="workout-date-field"><CalendarDays size={14}/><span>RECORD DATE</span><input type="date" value={workoutDate} onChange={(event) => setWorkoutDate(event.target.value)} /></label>
        <Button className="ledger-button" onClick={start}><Play size={16} fill="currentColor" />{todayPlan ? "Start today’s workout" : "Start quick workout"}</Button>
      </div>
      <div className="today-sheet-art" aria-hidden="true"><div className="plate-number">{String(weekday + 1).padStart(2, "0")}</div><div className="rule-mark"/></div>
    </section>
    <section className="metric-strip" aria-label="Training summary">
      <div><span>LAST 30 DAYS</span><strong>{completed.length}</strong><small>sessions logged</small></div>
      <div><span>ACTIVE PLAN</span><strong>{activePlan ? "01" : "—"}</strong><small>{activePlan?.name ?? "not set"}</small></div>
      <div><span>BODY WEIGHT</span><strong>{latestWeight ? toDisplayWeight(latestWeight.weightGrams, state.profile.unitSystem).replace(` ${state.profile.unitSystem}`, "") : "—"}</strong><small>{latestWeight ? state.profile.unitSystem : "not logged"}</small></div>
    </section>
    <section className="split-layout">
      <div className="ledger-section">
        <div className="section-topline"><p className="ledger-index">RECENT / ACTUAL WORK</p><button onClick={() => navigate("/history")}>All history <ArrowRight size={14}/></button></div>
        {recent.length ? <div className="history-list">{recent.map((session) => <button key={session.id} className="history-row" onClick={() => navigate(`/workout/${session.id}`)}><span className="set-stamp"><Check size={14}/></span><span><strong>{session.title}</strong><small>{new Date(`${session.date}T12:00:00`).toLocaleDateString("en", { month: "short", day: "numeric" })} · {session.exercises.length} movements</small></span><ChevronRight size={17}/></button>)}</div> : <EmptyLedger title="No completed sessions yet" body="Your actual training record begins with the first logged set." action={<Button variant="outline" onClick={start}>Start the first workout</Button>} />}
      </div>
      <aside className="training-aside">
        <div className="aside-visual"/><div className="aside-copy"><Sparkles size={16}/><p>TRAINING NOTE</p><strong>Plans guide your day. Your log tells the truth.</strong><span>Starting a session copies the plan into a protected actual-work record.</span></div>
      </aside>
    </section>
    {todayPlan && <section className="planned-list"><div className="section-topline"><p className="ledger-index">TODAY / PLANNED MOVEMENTS</p><span><Clock3 size={14}/> Ready when you are</span></div>{todayPlan.exercises.map((exercise, index) => <div key={exercise.id} className="planned-row"><span>{String(index + 1).padStart(2, "0")}</span><strong>{exercise.exerciseName}</strong><small>{exercise.targetSets} sets × {exercise.targetReps} reps</small></div>)}</section>}
  </AppShell>;
}
