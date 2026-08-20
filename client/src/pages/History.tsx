/** Training Ledger design reminder: history is actual evidence—settled, chronological, and deliberately editable only through confirmed choices. */
import { useState } from "react";
import { Check, ChevronDown, ChevronRight, Filter, History as HistoryIcon, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AppShell, EmptyLedger, PageHeading } from "@/components/AppShell";
import { useGym } from "@/contexts/GymContext";
import { toDisplayWeight } from "@/lib/workout-types";

type PendingDeletion = {
  kind: "exercise" | "session";
  sessionId: string;
  exerciseId?: string;
  label: string;
  description: string;
};

export default function History() {
  const [, navigate] = useLocation();
  const { state, removeExerciseFromSession, removeSession } = useGym();
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [pendingDeletion, setPendingDeletion] = useState<PendingDeletion | null>(null);
  const sessions = state.sessions.filter((session) => session.status === "completed").slice().reverse();
  const volume = (session: typeof sessions[number]) => session.exercises.flatMap((exercise) => exercise.sets).reduce((sum, set) => sum + set.weightGrams * set.reps, 0);
  const exerciseVolume = (exercise: typeof sessions[number]["exercises"][number]) => exercise.sets.reduce((sum, set) => sum + set.weightGrams * set.reps, 0);

  const confirmDeletion = async () => {
    if (!pendingDeletion) return;
    if (pendingDeletion.kind === "session") {
      await removeSession(pendingDeletion.sessionId);
      setExpandedSessionId((current) => current === pendingDeletion.sessionId ? null : current);
    } else if (pendingDeletion.exerciseId) {
      await removeExerciseFromSession(pendingDeletion.sessionId, pendingDeletion.exerciseId);
    }
    setPendingDeletion(null);
  };

  return <AppShell><PageHeading index="05" eyebrow="History" title="The record, as done." action={<Button variant="outline" disabled><Filter size={16}/> All sessions</Button>} /><p className="page-intro">Completed sessions preserve the work performed. Use <strong>Manage</strong> only when you need to remove an incorrect logged exercise or a whole workout day.</p>
    {sessions.length ? <section className="history-ledger">{sessions.map((session) => {
      const expanded = expandedSessionId === session.id;
      const sessionDate = new Date(`${session.date}T12:00:00`).toLocaleDateString("en", { month: "short", day: "numeric" });
      const fullSessionDate = new Date(`${session.date}T12:00:00`).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" });
      return <article className="history-ledger-entry" key={session.id}>
        <div className="history-ledger-row">
          <button type="button" onClick={() => navigate(`/workout/${session.id}`)} className="history-session-open" aria-label={`Open ${session.title} from ${fullSessionDate}`}><span className="set-stamp"><Check size={14}/></span><span className="history-date">{sessionDate}</span><span className="history-title"><strong>{session.title}</strong><small>{session.exercises.length} movements · {session.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0)} sets</small></span><span className="history-volume">{volume(session) ? toDisplayWeight(volume(session), state.profile.unitSystem) : "—"}<small>volume</small></span><ChevronRight size={17}/></button>
          <div className="history-row-actions"><button type="button" className="history-manage" onClick={() => setExpandedSessionId(expanded ? null : session.id)} aria-expanded={expanded}>{expanded ? "Close" : "Manage"}<ChevronDown size={14} className={expanded ? "rotate-180" : ""}/></button><button type="button" className="history-delete" onClick={() => setPendingDeletion({ kind: "session", sessionId: session.id, label: `Delete ${session.title}?`, description: `This will permanently remove the entire workout recorded on ${fullSessionDate}, including every logged exercise and set.` })} aria-label={`Delete whole ${session.title} workout`} title="Delete whole workout day"><Trash2 size={16}/></button></div>
        </div>
        {expanded && <div className="history-exercise-panel"><div className="history-exercise-panel-head"><div><p className="ledger-index">CORRECT THE RECORD</p><strong>Remove one movement or the whole day</strong></div><small>Deletion is permanent after confirmation.</small></div><div className="history-exercise-list">{session.exercises.map((exercise, exerciseIndex) => <div className="history-exercise-row" key={exercise.id}><span>{String(exerciseIndex + 1).padStart(2, "0")}</span><div><strong>{exercise.name}</strong><small>{exercise.sets.length} set{exercise.sets.length === 1 ? "" : "s"}{exerciseVolume(exercise) ? ` · ${toDisplayWeight(exerciseVolume(exercise), state.profile.unitSystem)} volume` : ""}</small></div><button type="button" onClick={() => setPendingDeletion({ kind: "exercise", sessionId: session.id, exerciseId: exercise.id, label: `Delete ${exercise.name}?`, description: `This will permanently remove ${exercise.name} and its ${exercise.sets.length} logged set${exercise.sets.length === 1 ? "" : "s"} from ${session.title} on ${fullSessionDate}.` })} aria-label={`Delete ${exercise.name} from ${session.title}`}><Trash2 size={15}/><span>Delete</span></button></div>)}{!session.exercises.length && <p className="history-exercise-empty">No movements remain in this workout. Delete the whole day if this record should no longer appear in History.</p>}</div></div>}
      </article>;
    })}</section> : <EmptyLedger title="Your history is clear" body="Completed workouts will collect here as a chronological, protected training record." action={<Button className="ledger-button" onClick={() => navigate("/")}><HistoryIcon size={16}/> Start a workout</Button>} />}
    <AlertDialog open={Boolean(pendingDeletion)} onOpenChange={(open) => { if (!open) setPendingDeletion(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{pendingDeletion?.label}</AlertDialogTitle><AlertDialogDescription>{pendingDeletion?.description}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep record</AlertDialogCancel><AlertDialogAction className="bg-[#8d3e33] text-white hover:bg-[#713027]" onClick={() => void confirmDeletion()}>Delete permanently</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </AppShell>;
}
