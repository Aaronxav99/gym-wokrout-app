/** Training Ledger design reminder: the exercise library is an orderly reference shelf, not an overwhelming management console. */
import { FormEvent, useState } from "react";
import { Archive, CirclePlus, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, EmptyLedger, PageHeading } from "@/components/AppShell";
import { useGym } from "@/contexts/GymContext";

export default function Exercises() {
  const { state, addExercise, archiveExercise } = useGym();
  const [query, setQuery] = useState(""); const [name, setName] = useState(""); const [muscle, setMuscle] = useState("Other"); const [equipment, setEquipment] = useState("Other");
  const exercises = state.exercises.filter((exercise) => exercise.active && [exercise.name, exercise.muscleGroup, exercise.equipment].join(" ").toLowerCase().includes(query.toLowerCase()));
  const create = async (event: FormEvent) => { event.preventDefault(); if (!name.trim()) return; await addExercise({ name: name.trim(), muscleGroup: muscle, equipment, category: "Custom" }); setName(""); };
  return <AppShell><PageHeading index="04" eyebrow="Exercises" title="Your movement library." /><p className="page-intro">Keep the names you use in the gym. Historical workout records retain their own exercise snapshots.</p>
    <section className="library-toolbar"><label><Search size={17}/><input placeholder="Search movements" value={query} onChange={(event) => setQuery(event.target.value)} /></label><span>{exercises.length} active</span></section>
    <div className="exercise-library">{exercises.length ? exercises.map((exercise, index) => <article key={exercise.id} className="exercise-library-row"><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{exercise.name}</h2><p>{exercise.muscleGroup} · {exercise.equipment}</p></div><span className="category-label"><Tag size={12}/>{exercise.category}</span><button aria-label={`Archive ${exercise.name}`} onClick={() => archiveExercise(exercise.id)}><Archive size={16}/></button></article>) : <EmptyLedger title="No matching movements" body="Try another search or add your first custom exercise." />}</div>
    <form className="library-add" onSubmit={create}><div><p className="ledger-index">CUSTOM / EXERCISE</p><h2>Add a movement</h2></div><label className="field-label">NAME<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Close-grip bench" /></label><label className="field-label">MUSCLE<select value={muscle} onChange={(event) => setMuscle(event.target.value)}>{["Chest", "Back", "Legs", "Shoulders", "Biceps", "Triceps", "Core", "Other"].map((option) => <option key={option}>{option}</option>)}</select></label><label className="field-label">EQUIPMENT<select value={equipment} onChange={(event) => setEquipment(event.target.value)}>{["Barbell", "Dumbbell", "Cable", "Machine", "Bodyweight", "Other"].map((option) => <option key={option}>{option}</option>)}</select></label><Button type="submit" className="ledger-button"><CirclePlus size={16}/> Add exercise</Button></form>
  </AppShell>;
}
