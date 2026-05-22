"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { registerPlayer } from "@/lib/contract";
import type { TxResult } from "@/lib/stellar";
import { TransactionResult } from "./TransactionResult";

type Props = {
  publicKey: string;
  disabled: boolean;
  onSuccess: () => void;
};

export function RegisterForm({ publicKey, disabled, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TxResult | null>(null);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const tx = await registerPlayer(publicKey, name.trim());
      setResult(tx);
      onSuccess();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel title="Register Player" icon={<UserPlus className="size-5" />}>
      <form className="space-y-4" onSubmit={submit}>
        <label className="block text-sm text-slate-300">
          Player name
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70"
            minLength={2}
            onChange={(event) => setName(event.target.value)}
            placeholder="Phat"
            required
            value={name}
          />
        </label>
        <button
          className="h-12 w-full rounded-2xl bg-cyan-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled || loading || !name.trim()}
          type="submit"
        >
          {loading ? "Registering..." : "Register Profile"}
        </button>
      </form>
      <TransactionResult error={error} result={result} />
    </Panel>
  );
}

export function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-xl shadow-slate-950/30 backdrop-blur">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-2xl bg-fuchsia-300/15 text-fuchsia-200">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
