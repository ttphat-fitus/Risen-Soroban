"use client";

import { useState } from "react";
import { Search, Trophy } from "lucide-react";
import { getProfile, type PlayerProfile } from "@/lib/contract";
import { Panel } from "./RegisterForm";

type Props = {
  sourcePublicKey: string;
  disabled: boolean;
};

export function ProfileReader({ sourcePublicKey, disabled }: Props) {
  const [playerKey, setPlayerKey] = useState<string | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const effectivePlayerKey = playerKey ?? sourcePublicKey;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setProfile(null);

    try {
      setProfile(await getProfile(sourcePublicKey, effectivePlayerKey.trim()));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not read profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel title="Read Player Profile" icon={<Search className="size-5" />}>
      <form className="space-y-4" onSubmit={submit}>
        <label className="block text-sm text-slate-300">
          Player public key
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 font-mono text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70"
            onChange={(event) => setPlayerKey(event.target.value)}
            placeholder="G..."
            required
            value={effectivePlayerKey}
          />
        </label>
        <button
          className="h-12 w-full rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-5 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled || loading || !effectivePlayerKey.trim()}
          type="submit"
        >
          {loading ? "Reading..." : "Get Profile"}
        </button>
      </form>

      {error ? (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {profile ? <ProfileCard profile={profile} /> : null}
    </Panel>
  );
}

export function ProfileCard({ profile }: { profile: PlayerProfile }) {
  return (
    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">
            Player
          </p>
          <h4 className="mt-1 text-xl font-semibold text-white">{profile.name}</h4>
        </div>
        <div className="grid size-12 place-items-center rounded-2xl bg-amber-300/15 text-amber-200">
          <Trophy className="size-6" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric label="Title" value={profile.title} />
        <Metric label="Level" value={profile.level} />
        <Metric label="Points" value={profile.points} />
        <Metric label="Streak" value={profile.streak} />
        <Metric label="Completed" value={profile.completed_quests} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}
