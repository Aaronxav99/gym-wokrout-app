/** Training Ledger design reminder: cloud data is a private mirror of a person’s record, never a shared training feed. */
import type { GymState } from "@/lib/workout-types";
import { supabase } from "@/lib/supabase";

export async function loadTrainingState(userId: string): Promise<GymState | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("training_records").select("state").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return (data?.state as GymState | undefined) ?? null;
}

export async function saveTrainingState(userId: string, state: GymState): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("training_records").upsert(
    { user_id: userId, state, updated_at: new Date().toISOString() },
    { onConflict: "user_id" },
  );
  if (error) throw error;
}
