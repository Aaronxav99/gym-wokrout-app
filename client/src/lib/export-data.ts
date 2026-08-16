/** Training Ledger design reminder: every export favors explicit dates, actual sets, and readable training evidence. */
import * as XLSX from "xlsx";
import { GymState, WorkoutSession } from "@/lib/workout-types";

const displayDate = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
const weekStart = (date: string) => { const value = new Date(`${date}T12:00:00`); const offset = (value.getDay() + 6) % 7; value.setDate(value.getDate() - offset); return value.toISOString().slice(0, 10); };
const kilograms = (grams: number) => Number((grams / 1000).toFixed(2));

export function describeWorkout(session: WorkoutSession) {
  const completed = session.exercises.filter((exercise) => exercise.sets.length);
  const setCount = completed.reduce((total, exercise) => total + exercise.sets.length, 0);
  const volume = completed.reduce((total, exercise) => total + exercise.sets.reduce((sets, set) => sets + set.weightGrams * set.reps, 0), 0);
  const movements = completed.map((exercise) => `${exercise.name} (${exercise.sets.length} ${exercise.sets.length === 1 ? "set" : "sets"})`).join(", ");
  return `${displayDate(session.date)} · ${session.title}. ${setCount ? `Completed ${setCount} working ${setCount === 1 ? "set" : "sets"} across ${completed.length} ${completed.length === 1 ? "movement" : "movements"}: ${movements}. Total volume: ${kilograms(volume)} kg.` : "No completed sets were recorded."}`;
}

export function weeklyDescriptions(state: GymState) {
  const byWeek = new Map<string, WorkoutSession[]>();
  state.sessions.filter((session) => session.status === "completed").forEach((session) => { const key = weekStart(session.date); byWeek.set(key, [...(byWeek.get(key) ?? []), session]); });
  return Array.from(byWeek.entries()).sort(([a], [b]) => b.localeCompare(a)).map(([week, sessions]) => {
    const sets = sessions.reduce((total, session) => total + session.exercises.reduce((sessionTotal, exercise) => sessionTotal + exercise.sets.length, 0), 0);
    const volume = sessions.reduce((total, session) => total + session.exercises.reduce((exerciseTotal, exercise) => exerciseTotal + exercise.sets.reduce((setTotal, set) => setTotal + set.weightGrams * set.reps, 0), 0), 0);
    return { week, sessions, description: `Week of ${displayDate(week)}: ${sessions.length} completed ${sessions.length === 1 ? "workout" : "workouts"}, ${sets} completed sets, and ${kilograms(volume)} kg of recorded volume.` };
  });
}

function downloadBlob(content: BlobPart, mime: string, fileName: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime })); const link = document.createElement("a"); link.href = url; link.download = fileName; link.click(); URL.revokeObjectURL(url);
}

export function downloadTrainingData(state: GymState) {
  downloadBlob(JSON.stringify({ exportedAt: new Date().toISOString(), trainingLedger: state }, null, 2), "application/json", `training-ledger-data-${new Date().toISOString().slice(0, 10)}.json`);
}

export function downloadWorkbook(state: GymState) {
  const unit = state.profile.unitSystem;
  const setRows = state.sessions.flatMap((session) => session.exercises.flatMap((exercise) => exercise.sets.map((set, index) => ({ Date: session.date, "Week beginning": weekStart(session.date), Workout: session.title, Split: session.splitName ?? "", Status: session.status, Exercise: exercise.name, Set: index + 1, [`Weight (${unit})`]: Number((unit === "kg" ? set.weightGrams / 1000 : set.weightGrams / 453.59237).toFixed(2)), Reps: set.reps, "Volume (kg)": kilograms(set.weightGrams * set.reps) }))));
  const sessionRows = state.sessions.map((session) => ({ Date: session.date, "Week beginning": weekStart(session.date), Workout: session.title, Status: session.status, Description: describeWorkout(session) }));
  const weightRows = state.bodyWeight.slice().sort((a, b) => a.date.localeCompare(b.date)).map((entry) => ({ Date: entry.date, [`Body weight (${unit})`]: Number((unit === "kg" ? entry.weightGrams / 1000 : entry.weightGrams / 453.59237).toFixed(2)) }));
  const weeklyRows = weeklyDescriptions(state).map((entry) => ({ "Week beginning": entry.week, Description: entry.description }));
  const workbook = XLSX.utils.book_new();
  [["Workout sets", setRows], ["Workout notes", sessionRows], ["Weekly notes", weeklyRows], ["Body weight", weightRows]].forEach(([name, rows]) => XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows as object[]), name as string));
  XLSX.writeFile(workbook, `training-ledger-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function downloadProgressChart(svg: SVGSVGElement | null) {
  if (!svg) return; const source = new XMLSerializer().serializeToString(svg); downloadBlob(source, "image/svg+xml;charset=utf-8", `training-ledger-progress-chart-${new Date().toISOString().slice(0, 10)}.svg`);
}
