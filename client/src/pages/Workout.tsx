/** Training Ledger design reminder: active logging keeps weights and reps large, completed sets stamped, and choices unambiguous. */
import { FormEvent, useState } from "react";
import { ArrowLeft, Check, CheckCheck, CirclePlus, Dumbbell, Minus, Save, Trash2 } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { AppShell, EmptyLedger, PageHeading } from "@/components/AppShell";
import { toDisplayWeight, toGrams } from "@/lib/workout-types";
import { useGym } from "@/contexts/GymContext";

export default function Workout() {
  const [, params] = useRoute("/workout/:id");
  const [, navigate] = useLocation();
  const { state, addExerciseToSession, addSet, completeWorkout, removeSet } = useGym();
  const session = state.sessions.find((item) => item.id === params?.id);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [setInputs, setSetInputs] = useState<Record<string, { weight: string; reps: string }>>({});
  if (!session) return <AppShell><PageHeading index="02" eyebrow="Workout" title="Session not found" /><EmptyLedger title="This workout is not in this local record." body="Return to today and start a new session." action={<Button onClick={() => navigate("/")}>Back to today</Button>} /></AppShell>;
  const editable = session.status === "in_progress";
  const submitSet = async (event: FormEvent, exerciseId: string) => {
    event.preventDefault(); const input = setInputs[exerciseId] ?? { weight: "", reps: "" }; const weight = Number(input.weight); const reps = Number(input.reps);
    if (!Number.isFinite(weight) || !Number.isFinite(reps) || weight < 0 || reps < 1) return;
    await addSet(session.id, exerciseId, { weightGrams: toGrams(weight, state.profile.unitSystem), reps, setType: "working" });
    setSetInputs((current) => ({ ...current, [exerciseId]: { weight: input.weight, reps: "" } }));
  };
  const finish = async () => { await completeWorkout(session.id); navigate("/history"); };
  return <AppShell>
    <div className="workout-header"><button className="back-link" onClick={() => navigate("/")}><ArrowLeft size={17}/>Today</button><span className={editable ? "live-state" : "complete-state"}>{editable ? "IN PROGRESS" : "COMPLETED"}</span></div>
    <PageHeading index="02" eyebrow={session.splitName || "Actual workout"} title={session.title} action={editable ? <Button className="ledger-button" disabled={!session.exercises.some((exercise) => exercise.sets.length)} onClick={finish}><Save size={16}/> Finish workout</Button> : undefined} />
    <p className="workout-note">Actual record · {new Date(`${session.date}T12:00:00`).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}</p>
    <section className="active-exercise-stack">
      {session.exercises.map((exercise, exerciseIndex) => <article className="exercise-log-card" key={exercise.id}>
        <div className="exercise-log-head"><span className="ledger-index">{String(exerciseIndex + 1).padStart(2, "0")}</span><div><h2>{exercise.name}</h2><p>{exercise.sets.length ? `${exercise.sets.length} set${exercise.sets.length === 1 ? "" : "s"} logged` : "Add your first working set"}</p></div><Dumbbell size={20}/></div>
        {exercise.sets.length > 0 && <div className="logged-sets">{exercise.sets.map((set, index) => <div key={set.id} className="logged-set"><span className="set-stamp"><Check size={14}/></span><small>SET {String(index + 1).padStart(2, "0")}</small><strong>{toDisplayWeight(set.weightGrams, state.profile.unitSystem)}</strong><strong>× {set.reps}</strong>{editable && <button aria-label="Delete set" onClick={() => removeSet(session.id, exercise.id, set.id)}><Trash2 size={15}/></button>}</div>)}</div>}
        {editable && <form className="set-entry" onSubmit={(event) => submitSet(event, exercise.id)}><label><span>WEIGHT / {state.profile.unitSystem.toUpperCase()}</span><input aria-label="Weight" inputMode="decimal" value={setInputs[exercise.id]?.weight ?? ""} onChange={(event) => setSetInputs((current) => ({ ...current, [exercise.id]: { ...(current[exercise.id] ?? { weight: "", reps: "" }), weight: event.target.value } }))} placeholder="0" /></label><span className="times-mark">×</span><label><span>REPS</span><input aria-label="Reps" inputMode="numeric" value={setInputs[exercise.id]?.reps ?? ""} onChange={(event) => setSetInputs((current) => ({ ...current, [exercise.id]: { ...(current[exercise.id] ?? { weight: "", reps: "" }), reps: event.target.value } }))} placeholder="0" /></label><Button type="submit" className="set-save"><CheckCheck size={17}/><span>Done set</span></Button></form>}
      </article>)}
    </section>
    {editable && <section className="add-movement"><div><CirclePlus size={18}/><strong>Add another movement</strong></div><select value={selectedExercise} onChange={(event) => setSelectedExercise(event.target.value)}><option value="">Choose from your library</option>{state.exercises.filter((exercise) => exercise.active).map((exercise) => <option key={exercise.id} value={exercise.id}>{exercise.name}</option>)}</select><Button variant="outline" disabled={!selectedExercise} onClick={async () => { const exercise = state.exercises.find((item) => item.id === selectedExercise); if (exercise) { await addExerciseToSession(session.id, exercise); setSelectedExercise(""); } }}><CirclePlus size={16}/> Add</Button></section>}
    {editable && !session.exercises.some((exercise) => exercise.sets.length) && <p className="low-emphasis"><Minus size={14}/> Finish becomes available after your first logged set.</p>}
  </AppShell>;
}
