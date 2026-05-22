"use client";

import { Wallet } from "lucide-react";
import type { WalletState } from "@/lib/stellar";

type Props = {
  wallet: WalletState | null;
  loading: boolean;
  onConnect: () => void;
};

export function WalletButton({ wallet, loading, onConnect }: Props) {
  const connected = Boolean(wallet?.publicKey);

  return (
    <div className="flex flex-col items-stretch gap-3 sm:items-end">
      <button
        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/15 px-5 text-sm font-semibold text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.18)] transition hover:border-cyan-200/60 hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
        onClick={onConnect}
        type="button"
      >
        <Wallet className="size-4" />
        {loading ? "Connecting..." : connected ? "Wallet Connected" : "Connect Wallet"}
      </button>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
          Network: {wallet?.network || "Testnet"}
        </div>
        {connected ? (
          <div className="mt-1 max-w-[17rem] truncate text-slate-400">
            {wallet?.publicKey}
          </div>
        ) : null}
      </div>
    </div>
  );
}
