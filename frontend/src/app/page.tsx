"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Sparkles, Zap } from "lucide-react";
import {
  ContractInfoCard,
  StatsStrip,
} from "@/components/ContractInfoCard";
import { ProfileReader } from "@/components/ProfileReader";
import { QuestForm } from "@/components/QuestForm";
import { RegisterForm } from "@/components/RegisterForm";
import { WalletButton } from "@/components/WalletButton";
import { getTotalPlayers } from "@/lib/contract";
import {
  connectFreighter,
  getWalletState,
  type WalletState,
} from "@/lib/stellar";

export default function Home() {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [totalPlayers, setTotalPlayers] = useState<number | null>(null);

  const disabledReason = useMemo(() => {
    if (!wallet?.publicKey) return "Connect Freighter to interact.";
    if (!wallet.isTestnet) return "Switch Freighter to Testnet.";
    return "";
  }, [wallet]);

  const formsDisabled = Boolean(disabledReason);

  useEffect(() => {
    getWalletState()
      .then(setWallet)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!wallet?.publicKey || !wallet.isTestnet) return;

    getTotalPlayers(wallet.publicKey)
      .then(setTotalPlayers)
      .catch(() => setTotalPlayers(null));
  }, [wallet?.isTestnet, wallet?.publicKey]);

  async function connect() {
    setWalletLoading(true);
    setWalletError("");

    try {
      const nextWallet = await connectFreighter();
      setWallet(nextWallet);
    } catch (cause) {
      setWalletError(
        cause instanceof Error ? cause.message : "Could not connect Freighter.",
      );
    } finally {
      setWalletLoading(false);
    }
  }

  async function refreshStats() {
    if (!wallet?.publicKey || !wallet.isTestnet) return;
    try {
      setTotalPlayers(await getTotalPlayers(wallet.publicKey));
    } catch {
      setTotalPlayers(null);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#060813] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_80%_18%,rgba(217,70,239,0.14),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.2),#060813_65%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-cyan-300/15 text-cyan-200 shadow-[0_0_26px_rgba(34,211,238,0.18)]">
              <Sparkles className="size-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">
                Stellar Testnet
              </p>
              <h1 className="text-xl font-semibold text-white">Risen Soroban</h1>
            </div>
          </div>
          <WalletButton loading={walletLoading} onConnect={connect} wallet={wallet} />
        </header>

        <section className="grid min-h-[440px] items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              <Zap className="size-4" />
              Gamified XP for blockchain learning
            </div>
            <h2 className="mt-6 max-w-3xl text-5xl font-black tracking-normal text-white sm:text-6xl">
              Risen Soroban
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              A gamified tutoring and service booking dApp on Stellar. This
              frontend follows the README contract: players register, complete
              quests, earn XP, level up, and read profile status on-chain.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
                onClick={connect}
                type="button"
              >
                Connect Wallet <ArrowRight className="size-4" />
              </button>
              <a
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 px-5 text-sm font-semibold text-slate-200 transition hover:border-fuchsia-300/50 hover:text-white"
                href="#register"
              >
                Register Player
              </a>
              <a
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 px-5 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/50 hover:text-white"
                href="#quest"
              >
                Complete Quest
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-fuchsia-300/15 text-fuchsia-200">
                <BookOpen className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-fuchsia-200/70">
                  On-chain loop
                </p>
                <h3 className="text-lg font-semibold text-white">
                  Register, complete, rank up
                </h3>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              {[
                ["01", "Create a player profile mapped to your wallet."],
                ["02", "Submit quest completions with difficulty rewards."],
                ["03", "Track points, level, streak, title, and completed quests."],
              ].map(([step, text]) => (
                <div
                  className="flex gap-4 rounded-2xl border border-white/10 bg-slate-950/45 p-4"
                  key={step}
                >
                  <div className="font-mono text-sm text-cyan-200">{step}</div>
                  <p className="text-sm leading-6 text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {(wallet?.warning || walletError || disabledReason) && (
          <div className="rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm text-amber-100">
            {walletError || wallet?.warning || disabledReason}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[22rem_1fr]">
          <div className="space-y-6">
            <ContractInfoCard />
            <StatsStrip totalPlayers={totalPlayers} />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div id="register">
              <RegisterForm
                disabled={formsDisabled}
                onSuccess={refreshStats}
                publicKey={wallet?.publicKey || ""}
              />
            </div>
            <div id="quest">
              <QuestForm
                disabled={formsDisabled}
                onSuccess={refreshStats}
                publicKey={wallet?.publicKey || ""}
              />
            </div>
            <div className="xl:col-span-2">
              <ProfileReader
                disabled={formsDisabled}
                sourcePublicKey={wallet?.publicKey || ""}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
