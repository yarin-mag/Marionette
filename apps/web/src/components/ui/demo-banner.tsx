import { FlaskConical } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2.5 flex items-center gap-3 text-sm">
      <FlaskConical className="h-4 w-4 text-amber-400 shrink-0" />
      <span className="text-amber-300 font-medium">Demo Mode</span>
      <span className="text-amber-400/70">
        You're viewing mock data — no real agents are connected. Remove{" "}
        <code className="text-amber-300 bg-amber-500/20 px-1 rounded">?demo=true</code> from the
        URL to return to live mode.
      </span>
    </div>
  );
}
