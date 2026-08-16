/** Training Ledger design reminder: precise, tactile data structures preserve a strict planned-versus-actual boundary. */
export type Exercise = {
  id: string;
  remoteId?: number;
  name: string;
  muscleGroup: string;
  equipment: string;
  category: string;
  active: boolean;
};

export type PlannedExercise = {
  id: string;
  remoteId?: number;
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  targetReps: number;
  targetWeightGrams?: number;
};

export type PlanDay = {
  id: string;
  remoteId?: number;
  name: string;
  splitName: string;
  scheduledDay: number;
  exercises: PlannedExercise[];
};

export type WorkoutPlan = {
  id: string;
  remoteId?: number;
  name: string;
  days: PlanDay[];
};

export type LoggedSet = {
  id: string;
  remoteId?: number;
  weightGrams: number;
  reps: number;
  setType: "working" | "warmup" | "drop" | "failure";
};

export type PerformedExercise = {
  id: string;
  remoteId?: number;
  exerciseId?: string;
  remoteExerciseId?: number;
  name: string;
  sets: LoggedSet[];
};

export type WorkoutSession = {
  id: string;
  remoteId?: number;
  planDayId?: string;
  date: string;
  title: string;
  splitName?: string;
  status: "in_progress" | "completed";
  exercises: PerformedExercise[];
};

export type WeightEntry = { id: string; remoteId?: number; date: string; weightGrams: number };

export type GymState = {
  profile: { displayName: string; unitSystem: "kg" | "lb" };
  exercises: Exercise[];
  plans: WorkoutPlan[];
  sessions: WorkoutSession[];
  bodyWeight: WeightEntry[];
};

export const toDisplayWeight = (grams: number, unitSystem: "kg" | "lb") => {
  const value = unitSystem === "kg" ? grams / 1000 : grams / 453.59237;
  return `${Number(value.toFixed(1))} ${unitSystem}`;
};

export const toGrams = (value: number, unitSystem: "kg" | "lb") => Math.round(value * (unitSystem === "kg" ? 1000 : 453.59237));

export const dayLabel = (index: number) => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index] ?? "—";
