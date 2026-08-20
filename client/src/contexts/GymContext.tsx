/** Training Ledger design reminder: one disciplined source of truth for a personal record, mirrored privately when cloud accounts are enabled. */
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { Exercise, GymState, LoggedSet, PlanDay, WorkoutPlan, WorkoutSession, WeightEntry } from "@/lib/workout-types";
import { useAuth } from "@/contexts/AuthContext";
import { loadTrainingState, saveTrainingState } from "@/lib/training-cloud";

const LEGACY_STORAGE_KEY = "training-ledger-v1";
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
  connection: "checking" | "cloud" | "local";
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

function restoreState(storageKey: string): GymState {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  } catch {
    return initialState;
  }
}

export function GymProvider({ children }: { children: ReactNode }) {
  const { enabled: cloudEnabled, user } = useAuth();
  const [state, setState] = useState<GymState>(() => cloudEnabled ? initialState : restoreState(LEGACY_STORAGE_KEY));
  const [connection, setConnection] = useState<ContextValue["connection"]>(cloudEnabled ? "checking" : "local");
  const [cloudLoadedFor, setCloudLoadedFor] = useState<string | null>(null);

  useEffect(() => {
    if (!cloudEnabled) { setConnection("local"); setCloudLoadedFor(null); return; }
    if (!user) return;
    let active = true;
    const userStorageKey = `training-ledger-cloud:${user.id}`;
    setConnection("checking");
    (async () => {
      try {
        const hasUserCache = Boolean(localStorage.getItem(userStorageKey));
        const localRecord = hasUserCache ? restoreState(userStorageKey) : restoreState(LEGACY_STORAGE_KEY);
        const remoteRecord = await loadTrainingState(user.id);
        const record = remoteRecord ?? localRecord;
        if (!active) return;
        setState(record);
        localStorage.setItem(userStorageKey, JSON.stringify(record));
        setCloudLoadedFor(user.id);
        setConnection("cloud");
        if (!remoteRecord) await saveTrainingState(user.id, record);
      } catch {
        if (active) setConnection("local");
      }
    })();
    return () => { active = false; };
  }, [cloudEnabled, user?.id]);

  useEffect(() => {
    if (!cloudEnabled) { localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(state)); return; }
    if (!user || cloudLoadedFor !== user.id || connection !== "cloud") return;
    const userStorageKey = `training-ledger-cloud:${user.id}`;
    localStorage.setItem(userStorageKey, JSON.stringify(state));
    const timer = window.setTimeout(() => { saveTrainingState(user.id, state).catch(() => setConnection("local")); }, 650);
    return () => window.clearTimeout(timer);
  }, [cloudEnabled, user?.id, cloudLoadedFor, connection, state]);

  const value = useMemo<ContextValue>(() => ({
    state,
    connection,
    async addExercise(exercise) {
      setState((current) => ({ ...current, exercises: [...current.exercises, { ...exercise, id: id(), active: true }] }));
    },
    async archiveExercise(exerciseId) {
      setState((current) => ({ ...current, exercises: current.exercises.map((item) => item.id === exerciseId ? { ...item, active: false } : item) }));
    },
    async createPlan(plan) {
      setState((current) => ({ ...current, plans: [...current.plans, { ...plan, id: id() }] }));
    },
    async startWorkout(day, date = today()) {
      const session: WorkoutSession = {
        id: id(), planDayId: day?.id, date, title: day?.name ?? "Quick workout", splitName: day?.splitName, status: "in_progress",
        exercises: (day?.exercises ?? []).map((item) => ({ id: id(), exerciseId: item.exerciseId, name: item.exerciseName, sets: [] })),
      };
      setState((current) => ({ ...current, sessions: [...current.sessions, session] }));
      return session;
    },
    async addExerciseToSession(sessionId, exercise) {
      setState((current) => ({ ...current, sessions: current.sessions.map((item) => item.id === sessionId ? { ...item, exercises: [...item.exercises, { id: id(), exerciseId: exercise.id, name: exercise.name, sets: [] }] } : item) }));
    },
    async addSet(sessionId, performedExerciseId, set) {
      setState((current) => ({ ...current, sessions: current.sessions.map((item) => item.id === sessionId ? { ...item, exercises: item.exercises.map((exercise) => exercise.id === performedExerciseId ? { ...exercise, sets: [...exercise.sets, { ...set, id: id() }] } : exercise) } : item) }));
    },
    async removeSet(sessionId, performedExerciseId, setId) {
      setState((current) => ({ ...current, sessions: current.sessions.map((item) => item.id === sessionId ? { ...item, exercises: item.exercises.map((exercise) => exercise.id === performedExerciseId ? { ...exercise, sets: exercise.sets.filter((set) => set.id !== setId) } : exercise) } : item) }));
    },
    async completeWorkout(sessionId) {
      setState((current) => ({ ...current, sessions: current.sessions.map((item) => item.id === sessionId ? { ...item, status: "completed" } : item) }));
    },
    async addBodyWeight(weightGrams, date = today()) {
      const entry: WeightEntry = { id: id(), date, weightGrams };
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
