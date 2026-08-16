/** Training Ledger design reminder: personal settings remain small, plain-spoken, and safely out of the primary training flow. */
import { FormEvent, useState } from "react";
import { Database, HardDrive, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, PageHeading } from "@/components/AppShell";
import { useGym } from "@/contexts/GymContext";

export default function Settings() {
  const { state, updateProfile, connection } = useGym(); const [displayName, setDisplayName] = useState(state.profile.displayName); const [unitSystem, setUnitSystem] = useState(state.profile.unitSystem);
  const save = (event: FormEvent) => { event.preventDefault(); updateProfile(displayName || "Athlete", unitSystem); };
  return <AppShell><PageHeading index="07" eyebrow="Settings" title="Keep the record yours." />
    <form className="settings-sheet" onSubmit={save}><div className="settings-sheet-head"><Settings2 size={21}/><div><p className="ledger-index">PROFILE / PREFERENCES</p><h2>Training profile</h2></div></div><label className="field-label">DISPLAY NAME<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label><fieldset><legend>WEIGHT UNIT</legend><label className={unitSystem === "kg" ? "selected" : ""}><input type="radio" value="kg" checked={unitSystem === "kg"} onChange={() => setUnitSystem("kg")} /> Kilograms <span>kg</span></label><label className={unitSystem === "lb" ? "selected" : ""}><input type="radio" value="lb" checked={unitSystem === "lb"} onChange={() => setUnitSystem("lb")} /> Pounds <span>lb</span></label></fieldset><Button className="ledger-button" type="submit">Save preferences</Button></form>
    <section className="system-note"><HardDrive size={20}/><div><p className="ledger-index">LOCAL-FIRST RECORD</p><strong>Designed to run on your own machine.</strong><span>Workout history stays in this browser as a resilient local record; when the companion API is available, new workout actions also sync to its local SQLite database.</span></div></section><section className="system-note"><Database size={20}/><div><p className="ledger-index">CONNECTION STATUS</p><strong>{connection === "connected" ? "Companion API connected" : connection === "checking" ? "Checking companion API" : "Local mode active"}</strong><span>{connection === "connected" ? "The browser can reach the local FastAPI service." : "The interface remains usable with browser-local persistence. Start the backend to enable SQLite sync."}</span></div></section>
  </AppShell>;
}
