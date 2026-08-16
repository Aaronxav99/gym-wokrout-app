/** Training Ledger design reminder: plans are calm future intent, structured as readable weekly training cards rather than dense configuration tables. */
import { FormEvent, useMemo, useState } from "react";
import { CalendarDays, Check, CirclePlus, Dumbbell, ListChecks, Play, Plus, X } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AppShell, EmptyLedger, PageHeading } from "@/components/AppShell";
import { useGym } from "@/contexts/GymContext";
import { PlanDay, PlannedExercise } from "@/lib/workout-types";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const localToday = () => { const now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); return now.toISOString().slice(0, 10); };

export default function Plans() {
  const [, navigate] = useLocation();
  const { state, createPlan, startWorkout } = useGym();
  const [planName, setPlanName] = useState("My training week");
  const [dayName, setDayName] = useState("Upper body");
  const [scheduledDay, setScheduledDay] = useState("0");
  const [selected, setSelected] = useState<string[]>([]);
  const [days, setDays] = useState<PlanDay[]>([]);
  const [followingDay, setFollowingDay] = useState<PlanDay | null>(null);
  const [workoutDate, setWorkoutDate] = useState(localToday);
  const activeExercises = state.exercises.filter((exercise) => exercise.active);
  const canSave = days.length > 0 && planName.trim();
  const addDay = () => {
    if (!dayName.trim() || !selected.length) return;
    const exercises: PlannedExercise[] = selected.map((exerciseId) => { const exercise = activeExercises.find((item) => item.id === exerciseId)!; return { id: crypto.randomUUID(), exerciseId, exerciseName: exercise.name, targetSets: 3, targetReps: 10 }; });
    setDays((current) => [...current, { id: crypto.randomUUID(), name: dayName, splitName: dayName, scheduledDay: Number(scheduledDay), exercises }]); setSelected([]); setDayName("Next session");
  };
  const savePlan = async (event: FormEvent) => { event.preventDefault(); if (!canSave) return; await createPlan({ name: planName, days }); setDays([]); setPlanName("My training week"); };
  const begin = async (day: PlanDay) => { const session = await startWorkout(day, workoutDate); navigate(`/workout/${session.id}`); };
  return <AppShell>
    <PageHeading index="03" eyebrow="Plan" title="Train what you planned." />
    <p className="page-intro">Plans are future intent. A workout becomes a separate actual record only when you begin it.</p>
    {state.plans.map((plan) => <section className="plan-sheet" key={plan.id}><div className="plan-sheet-head"><div><p className="ledger-index">STEP 01 / FOLLOWING</p><h2>{plan.name}</h2></div><CalendarDays size={24}/></div><p className="plan-flow-copy">Choose a planned day first. Its exercises then become the actual record you complete.</p><div className="plan-days">{plan.days.map((day) => <article key={day.id} className={`plan-day-card ${followingDay?.id === day.id ? "is-following" : ""}`}><div><span>{weekdays[day.scheduledDay]?.slice(0, 3).toUpperCase()}</span><h3>{day.name}</h3><p>{day.exercises.length} movements</p></div><Button variant="outline" onClick={() => setFollowingDay(day)} aria-pressed={followingDay?.id === day.id}><ListChecks size={16}/>{followingDay?.id === day.id ? "Selected" : "Choose day"}</Button><ul>{day.exercises.map((exercise) => <li key={exercise.id}><Check size={13}/>{exercise.exerciseName}<small>{exercise.targetSets}×{exercise.targetReps}</small></li>)}</ul></article>)}</div>{followingDay && <section className="follow-sheet"><div className="follow-sheet-head"><div><p className="ledger-index">STEP 02 / EXERCISES</p><h3>{followingDay.name}</h3></div><span>{followingDay.exercises.length} MOVEMENTS</span></div><div className="follow-exercises">{followingDay.exercises.map((exercise, index) => <div key={exercise.id}><span className="set-stamp">{String(index + 1).padStart(2, "0")}</span><strong>{exercise.exerciseName}</strong><small>{exercise.targetSets} sets × {exercise.targetReps} reps</small></div>)}</div><div className="follow-actions"><label className="field-label">ACTUAL DATE<input type="date" value={workoutDate} onChange={(event) => setWorkoutDate(event.target.value)} /></label><Button className="ledger-button" onClick={() => begin(followingDay)}><Play size={16}/> Begin actual workout</Button></div></section>}</section>)}
    {!state.plans.length && <EmptyLedger title="Build your first week" body="Add a training day and its movements below. You can always make a quick workout when your schedule changes." />}
    <form className="plan-builder" onSubmit={savePlan}><div className="builder-topline"><div><p className="ledger-index">NEW / WEEKLY PLAN</p><h2>Plan the repeatable work.</h2></div><Dumbbell size={22}/></div><label className="field-label">PLAN NAME<input value={planName} onChange={(event) => setPlanName(event.target.value)} /></label><div className="day-builder"><div className="day-builder-heading"><span>ADD A DAY</span><small>{days.length} prepared</small></div><div className="builder-grid"><label className="field-label">SESSION NAME<input value={dayName} onChange={(event) => setDayName(event.target.value)} /></label><label className="field-label">SCHEDULED<select value={scheduledDay} onChange={(event) => setScheduledDay(event.target.value)}>{weekdays.map((day, index) => <option value={index} key={day}>{day}</option>)}</select></label></div><div className="exercise-picker">{activeExercises.map((exercise) => <button type="button" key={exercise.id} className={selected.includes(exercise.id) ? "selected" : ""} onClick={() => setSelected((current) => current.includes(exercise.id) ? current.filter((item) => item !== exercise.id) : [...current, exercise.id])}>{selected.includes(exercise.id) ? <Check size={13}/> : <Plus size={13}/>} {exercise.name}</button>)}</div><Button type="button" variant="outline" onClick={addDay} disabled={!selected.length}><CirclePlus size={16}/> Add day to plan</Button></div>{days.length > 0 && <div className="draft-days">{days.map((day) => <div key={day.id}><span>{weekdays[day.scheduledDay].slice(0, 3)}</span><strong>{day.name}</strong><small>{day.exercises.length} movements</small><button type="button" onClick={() => setDays((current) => current.filter((item) => item.id !== day.id))} aria-label="Remove day"><X size={15}/></button></div>)}</div>}<Button type="submit" className="ledger-button" disabled={!canSave}><Check size={16}/> Save weekly plan</Button></form>
  </AppShell>;
}
