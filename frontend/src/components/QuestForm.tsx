"use client";

import { useState } from "react";
import { Swords, RotateCcw } from "lucide-react";
import { completeQuest, resetStreak } from "@/lib/contract";
import type { TxResult } from "@/lib/stellar";
import { TransactionResult } from "./TransactionResult";
import { Panel } from "./RegisterForm";

type Props = {
  publicKey: string;
  disabled: boolean;
  onSuccess: () => void;
};

export function QuestForm({ publicKey, disabled, onSuccess }: Props) {
  const [questName, setQuestName] = useState("build");
  const [difficulty, setDifficulty] = useState(3);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [result, setResult] = useState<TxResult | null>(null);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const tx = await completeQuest(publicKey, difficulty, questName.trim());
      setResult(tx);
      onSuccess();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Quest completion failed.");
    } finally {
      setLoading(false);
    }
  }

  async function reset() {
    setResetting(true);
    setResult(null);
    setError("");

    try {
      const tx = await resetStreak(publicKey);
      setResult(tx);
      onSuccess();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Reset streak failed.");
    } finally {
      setResetting(false);
    }
  }

  return (
    <Panel title="Complete Quest" icon={<Swords className="size-5" />}>
      <form className="space-y-4" onSubmit={submit}>
        <label className="block text-sm text-slate-300">
          Quest name
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70"
            onChange={(event) => setQuestName(event.target.value)}
            placeholder="build"
            required
            value={questName}
          />
        </label>
        <label className="block text-sm text-slate-300">
          Difficulty: {difficulty}
          <input
            className="mt-3 w-full accent-cyan-300"
            max={4}
            min={1}
            onChange={(event) => setDifficulty(Number(event.target.value))}
            type="range"
            value={difficulty}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <button
            className="h-12 rounded-2xl bg-fuchsia-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-fuchsia-200 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled || loading || !questName.trim()}
            type="submit"
          >
            {loading ? "Completing..." : "Complete Quest"}
          </button>
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 text-sm font-semibold text-slate-200 transition hover:border-rose-300/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled || resetting}
            onClick={reset}
            type="button"
          >
            <RotateCcw className="size-4" />
            {resetting ? "Resetting..." : "Reset Streak"}
          </button>
        </div>
      </form>
      <TransactionResult error={error} result={result} />
    </Panel>
  );
}
