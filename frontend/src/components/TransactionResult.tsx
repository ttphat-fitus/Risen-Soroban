import { CheckCircle2, ExternalLink } from "lucide-react";
import type { TxResult } from "@/lib/stellar";

type Props = {
  result?: TxResult | null;
  error?: string;
};

export function TransactionResult({ result, error }: Props) {
  if (!result && !error) return null;

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-50">
      <div className="flex items-center gap-2 font-semibold">
        <CheckCircle2 className="size-4" />
        Transaction confirmed
      </div>
      <div className="mt-2 break-all text-emerald-100/80">
        Status: {result?.status}
      </div>
      {result?.hash ? (
        <a
          className="mt-2 inline-flex items-center gap-2 text-cyan-200 hover:text-cyan-100"
          href={result.explorerUrl}
          target="_blank"
          rel="noreferrer"
        >
          View on Stellar Expert <ExternalLink className="size-3.5" />
        </a>
      ) : null}
    </div>
  );
}
