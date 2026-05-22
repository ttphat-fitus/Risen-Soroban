import {
  addressArg,
  simulateContractCall,
  stringArg,
  symbolArg,
  submitContractCall,
  u32Arg,
  type TxResult,
} from "./stellar";

export type PlayerProfile = {
  name: string;
  points: number;
  level: number;
  streak: number;
  completed_quests: number;
  title: string;
};

export async function registerPlayer(
  publicKey: string,
  name: string,
): Promise<TxResult> {
  return submitContractCall(publicKey, "register", [
    addressArg(publicKey),
    stringArg(name),
  ]);
}

export async function completeQuest(
  publicKey: string,
  difficulty: number,
  questName: string,
): Promise<TxResult> {
  return submitContractCall(publicKey, "complete_quest", [
    addressArg(publicKey),
    u32Arg(difficulty),
    symbolArg(questName),
  ]);
}

export async function resetStreak(publicKey: string): Promise<TxResult> {
  return submitContractCall(publicKey, "reset_streak", [addressArg(publicKey)]);
}

export async function getProfile(
  sourcePublicKey: string,
  playerPublicKey: string,
): Promise<PlayerProfile> {
  const raw = await simulateContractCall(sourcePublicKey, "get_profile", [
    addressArg(playerPublicKey),
  ]);

  return normalizeProfile(raw);
}

export async function getTotalPlayers(sourcePublicKey: string): Promise<number> {
  const raw = await simulateContractCall(sourcePublicKey, "get_total_players");
  return Number(raw || 0);
}

function normalizeProfile(raw: unknown): PlayerProfile {
  const record =
    raw instanceof Map
      ? Object.fromEntries(raw.entries())
      : typeof raw === "object" && raw !== null
        ? (raw as Record<string, unknown>)
        : {};

  return {
    name: String(record.name || "anonymous"),
    points: Number(record.points || 0),
    level: Number(record.level || 1),
    streak: Number(record.streak || 0),
    completed_quests: Number(record.completed_quests || 0),
    title: String(record.title || "ROOKIE"),
  };
}
