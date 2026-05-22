import { Activity, BadgeCheck, ExternalLink, RadioTower } from "lucide-react";
import { CONTRACT_ID, RPC_URL, STELLAR_NETWORK } from "@/lib/stellar";

export function ContractInfoCard() {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-2xl bg-cyan-300/15 text-cyan-200">
          <RadioTower className="size-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
            Contract
          </p>
          <h2 className="text-lg font-semibold text-white">Quest XP Core</h2>
        </div>
      </div>

      <dl className="mt-6 space-y-4 text-sm">
        <Info label="Network" value={STELLAR_NETWORK} />
        <Info label="RPC" value={RPC_URL} />
        <Info label="Contract ID" value={CONTRACT_ID} mono />
      </dl>

      <div className="mt-6 grid gap-3">
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-100">
            <BadgeCheck className="size-4" />
            README verified methods
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Register profiles, complete quests, reset streaks, read profiles,
            and track total players on-chain.
          </p>
        </div>

        <a
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-200/50 hover:text-white"
          href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`}
          target="_blank"
          rel="noreferrer"
        >
          Open Contract <ExternalLink className="size-4" />
        </a>
      </div>
    </aside>
  );
}

function Info({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">
        {label}
      </dt>
      <dd
        className={`mt-1 break-all text-slate-200 ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

export function StatsStrip({ totalPlayers }: { totalPlayers: number | null }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        ["XP Titles", "ROOKIE to LEGEND"],
        ["Total Players", totalPlayers === null ? "Connect to read" : totalPlayers],
        ["Quest Events", "On-chain logs"],
      ].map(([label, value]) => (
        <div
          className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"
          key={label}
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
            <Activity className="size-3.5" />
            {label}
          </div>
          <div className="mt-2 text-lg font-semibold text-white">{value}</div>
        </div>
      ))}
    </div>
  );
}
