/** Training Ledger design reminder: one disciplined source of truth for a personal, local-first workout record. */
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, tryApi } from "@/lib/api";
import { Exercise, GymState, LoggedSet, PlanDay, WorkoutPlan, WorkoutSession, WeightEntry } from "@/lib/workout-types";

const STORAGE_KEY = "training-ledger-v1";
const id = () => crypto.randomUUID();
const today = () => new Date().toISOString().slice(0, 10);

const seedExercises: Exercise[] = [
  ["Bench Press", "Chest", "Barbell", "Compound"], ["Incline Bench Press", "Chest", "Dumbbell", "Compound"],
  ["Cable Fly", "Chest", "Cable", "Isolation"], ["Triceps Pushdown", "Triceps", "Cable", "Isolation"],
  ["Lat Pulldown", "Back", "Cable", "Compound"], ["Seated Cable Row", "Back", "Cable", "Compound"],
  ["Dumbbell Curl", "Biceps", "Dumbbell", "Isolation"], ["Squat", "Legs", "Barbell", "Compound"],
  ["Romanian Deadlift", "Hamstrings", "Barbell", "Compound"], ["Leg Curl", "Hamstrings", "Machine", "Isolation"],
].map(([name, muscleGroup, equipment, category]) => ({ id: id(), name, muscleGroup, equipment, category, active: true }));

const initialState: GymState = {
  profile: { displayName: "Athlete", unitSystem: "kg" },
  exercises: seedExercises,
  plans: [],
  sessions: [],
  bodyWeight: [],
};

type ContextValue = {
  state: GymState;
  connection: "checking" | "connected" | "local";
  addExercise: (exercise: Omit<Exercise, "id" | "remoteId" | "active">) => Promise<void>;
  archiveExercise: (exerciseId: string) => Promise<void>;
  createPlan: (plan: Omit<WorkoutPlan, "id" | "remoteId">) => Promise<void>;
  startWorkout: (day?: PlanDay, date?: string) => Promise<WorkoutSession>;
  addExerciseToSession: (sessionId: string, exercise: Exercise) => Promise<void>;
  addSet: (sessionId: string, performedExerciseId: string, set: Omit<LoggedSet, "id" | "remoteId">) => Promise<void>;
  removeSet: (sessionId: string, performedExerciseId: string, setId: string) => Promise<void>;
  completeWorkout: (sessionId: string) => Promise<void>;
  addBodyWeight: (weightGrams: number, date?: string) => Promise<void>;
  updateProfile: (displayName: string, unitSystem: "kg" | "lb") => void;
};

const GymContext = createContext<ContextValue | null>(null);

function restoreState(): GymState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  } catch {
    return initialState;
  }
}

export function GymProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GymState>(restoreState);
  const [connection, setConnection] = useState<ContextValue["connection"]>("checking");

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);

  useEffect(() => {
    let mounted = true;
    apiRequest<Array<{ id: number; name: string; muscle_group: string | null; equipment: string | null; category: string | null; is_active: boolean }>>("/exercises")
      .then((items) => {
        if (!mounted) return;
        setConnection("connected");
        setState((current) => ({
          ...current,
          exercises: items.map((item) => ({
            id: `api-${item.id}`, remoteId: item.id, name: item.name, muscleGroup: item.muscle_group ?? "Other",
            equipment: item.equipment ?? "Other", category: item.category ?? "Other", active: item.is_active,
          })),
        }));
      })
      .catch(() => mounted && setConnection("local"));
    return () => { mounted = false; };
  }, []);

  const value = useMemo<ContextValue>(() => ({
    state,
    connection,
    async addExercise(exercise) {
      const remote = await tryApi<{ id: number }>("/exercises", { method: "POST", body: JSON.stringify({ name: exercise.name, muscle_group: exercise.muscleGroup, equipment: exercise.equipment, category: exercise.category }) });
      setState((current) => ({ ...current, exercises: [...current.exercises, { ...exercise, id: remote ? `api-${remote.id}` : id(), remoteId: remote?.id, active: true }] }));
    },
    async archiveExercise(exerciseId) {
      const exercise = state.exercises.find((item) => item.id === exerciseId);
      if (exercise?.remoteId) await tryApi(`/exercises/${exercise.remoteId}`, { method: "DELETE" });
      setState((current) => ({ ...current, exercises: current.exercises.map((item) => item.id === exerciseId ? { ...item, active: false } : item) }));
    },
    async createPlan(plan) {
      const remote = await tryApi<{ id: number; weeks: Array<{ days: Array<{ id: number; planned_exercises: Array<{ id: number }> }> }> }>("/plans", {
        method: "POST",
        body: JSON.stringify({ name: plan.name, weeks: [{ week_number: 1, days: plan.days.map((day) => ({ name: day.name, split_name: day.splitName, scheduled_day: day.scheduledDay, exercises: day.exercises.map((item) => ({ exercise_id: state.exercises.find((exercise) => exercise.id === item.exerciseId)?.remoteId, exercise_name: item.exerciseName, target_sets: item.targetSets, target_reps: item.targetReps, target_weight_grams: item.targetWeightGrams })) })) }] }),
      });
      const synced: WorkoutPlan = { ...plan, id: id(), remoteId: remote?.id, days: plan.days.map((day, dayIndex) => ({ ...day, remoteId: remote?.weeks[0]?.days[dayIndex]?.id, exercises: day.exercises.map((exercise, exerciseIndex) => ({ ...exercise, remoteId: remote?.weeks[0]?.days[dayIndex]?.planned_exercises[exerciseIndex]?.id })) })) };
      setState((current) => ({ ...current, plans: [...current.plans, synced] }));
    },
    async startWorkout(day, date = today()) {
      const remote = await tryApi<{ id: number; performed_exercises: Array<{ id: number }> }>("/workout-sessions", { method: "POST", body: JSON.stringify(day?.remoteId ? { workout_day_id: day.remoteId, session_date: date } : { title: day?.name ?? "Quick workout", split_name: day?.splitName, session_date: date }) });
      const session: WorkoutSession = {
        id: id(), remoteId: remote?.id, planDayId: day?.id, date, title: day?.name ?? "Quick workout", splitName: day?.splitName, status: "in_progress",
        exercises: (day?.exercises ?? []).map((item, index) => ({ id: id(), remoteId: remote?.performed_exercises[index]?.id, exerciseId: item.exerciseId, remoteExerciseId: state.exercises.find((exercise) => exercise.id === item.exerciseId)?.remoteId, name: item.exerciseName, sets: [] })),
      };
      setState((current) => ({ ...current, sessions: [...current.sessions, session] }));
      return session;
    },
    async addExerciseToSession(sessionId, exercise) {
      const session = state.sessions.find((item) => item.id === sessionId);
      const remote = session?.remoteId ? await tryApi<{ id: number }>(`/workout-sessions/${session.remoteId}/exercises`, { method: "POST", body: JSON.stringify({ exercise_id: exercise.remoteId, exercise_name: exercise.name }) }) : undefined;
      setState((current) => ({ ...current, sessions: current.sessions.map((item) => item.id === sessionId ? { ...item, exercises: [...item.exercises, { id: id(), remoteId: remote?.id, exerciseId: exercise.id, remoteExerciseId: exercise.remoteId, name: exercise.name, sets: [] }] } : item) }));
    },
    async addSet(sessionId, performedExerciseId, set) {
      const session = state.sessions.find((item) => item.id === sessionId);
      const performed = session?.exercises.find((item) => item.id === performedExerciseId);
      const remote = performed?.remoteId ? await tryApi<{ id: number }>(`/performed-exercises/${performed.remoteId}/sets`, { method: "POST", body: JSON.stringify({ weight_grams: set.weightGrams, reps: set.reps, set_type: set.setType }) }) : undefined;
      setState((current) => ({ ...current, sessions: current.sessions.map((item) => item.id === sessionId ? { ...item, exercises: item.exercises.map((exercise) => exercise.id === performedExerciseId ? { ...exercise, sets: [...exercise.sets, { ...set, id: id(), remoteId: remote?.id }] } : exercise) } : item) }));
    },
    async removeSet(sessionId, performedExerciseId, setId) {
      const found = state.sessions.find((item) => item.id === sessionId)?.exercises.find((item) => item.id === performedExerciseId)?.sets.find((item) => item.id === setId);
      if (found?.remoteId) await tryApi(`/sets/${found.remoteId}`, { method: "DELETE" });
      setState((current) => ({ ...current, sessions: current.sessions.map((item) => item.id === sessionId ? { ...item, exercises: item.exercises.map((exercise) => exercise.id === performedExerciseId ? { ...exercise, sets: exercise.sets.filter((set) => set.id !== setId) } : exercise) } : item) }));
    },
    async completeWorkout(sessionId) {
      const session = state.sessions.find((item) => item.id === sessionId);
      if (session?.remoteId) await tryApi(`/workout-sessions/${session.remoteId}/complete`, { method: "POST" });
      setState((current) => ({ ...current, sessions: current.sessions.map((item) => item.id === sessionId ? { ...item, status: "completed" } : item) }));
    },
    async addBodyWeight(weightGrams, date = today()) {
      const remote = await tryApi<{ id: number }>("/body-weight", { method: "POST", body: JSON.stringify({ weight_grams: weightGrams, measured_at: date }) });
      const entry: WeightEntry = { id: id(), remoteId: remote?.id, date, weightGrams };
      setState((current) => ({ ...current, bodyWeight: [...current.bodyWeight.filter((item) => item.date !== entry.date), entry] }));
    },
    updateProfile(displayName, unitSystem) { setState((current) => ({ ...current, profile: { displayName, unitSystem } })); },
  }), [connection, state]);

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
}

export function useGym() {
  const context = useContext(GymContext);
  if (!context) throw new Error("useGym must be used within GymProvider");
  return context;
}
