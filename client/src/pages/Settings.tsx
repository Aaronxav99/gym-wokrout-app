/** Training Ledger design reminder: personal settings remain small, plain-spoken, and safely out of the primary training flow. */
import { FormEvent, useState } from "react";
import { Cloud, Database, HardDrive, LogOut, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, PageHeading } from "@/components/AppShell";
import { useGym } from "@/contexts/GymContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Settings() {
  const { state, updateProfile, connection } = useGym(); const [displayName, setDisplayName] = useState(state.profile.displayName); const [unitSystem, setUnitSystem] = useState(state.profile.unitSystem);
  const { enabled, user, signOut } = useAuth();
  const save = (event: FormEvent) => { event.preventDefault(); updateProfile(displayName || "Athlete", unitSystem); };
  return <AppShell><PageHeading index="07" eyebrow="Settings" title="Keep the record yours." />
    <form className="settings-sheet" onSubmit={save}><div className="settings-sheet-head"><Settings2 size={21}/><div><p className="ledger-index">PROFILE / PREFERENCES</p><h2>Training profile</h2></div></div><label className="field-label">DISPLAY NAME<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label><fieldset><legend>WEIGHT UNIT</legend><label className={unitSystem === "kg" ? "selected" : ""}><input type="radio" value="kg" checked={unitSystem === "kg"} onChange={() => setUnitSystem("kg")} /> Kilograms <span>kg</span></label><label className={unitSystem === "lb" ? "selected" : ""}><input type="radio" value="lb" checked={unitSystem === "lb"} onChange={() => setUnitSystem("lb")} /> Pounds <span>lb</span></label></fieldset><Button className="ledger-button" type="submit">Save preferences</Button></form>
    {enabled && user && <section className="system-note"><Cloud size={20}/><div><p className="ledger-index">PRIVATE CLOUD ACCOUNT</p><strong>{user.email}</strong><span>Every account receives a private training record that can be opened on another device after signing in.</span><button type="button" onClick={() => void signOut()} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary underline underline-offset-4">Sign out <LogOut size={15}/></button></div></section>}<section className="system-note"><HardDrive size={20}/><div><p className="ledger-index">LOCAL SAFETY COPY</p><strong>Designed to keep a usable browser record.</strong><span>Your browser retains a local copy for resilience. Use the Progress page exports as an independent backup.</span></div></section><section className="system-note"><Database size={20}/><div><p className="ledger-index">CONNECTION STATUS</p><strong>{connection === "cloud" ? "Private cloud sync active" : connection === "checking" ? "Opening private training record" : "Local mode active"}</strong><span>{connection === "cloud" ? "Your signed-in account is synchronizing a private record across devices." : enabled ? "Cloud sync is unavailable at the moment; this device still has a local copy." : "Configure Supabase to add secure accounts and cross-device sync."}</span></div></section>
  </AppShell>;
}
