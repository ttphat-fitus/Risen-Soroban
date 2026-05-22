# Risen Soroban Frontend

Next.js UI for the Stellar Quest XP contract described in the root `README.md`.

## Features

- Freighter wallet connection
- Testnet network status and warning states
- Register player profile
- Complete quest and reset streak
- Read player profile
- Read total player count
- Stellar Expert transaction links

## Contract

Default Testnet contract:

```text
CC5TEK3IFXJGECTPJF3KFXVKWR44UDMDXBYPYVHEQ5KPIIXIIRQOHFZC
```

Methods used:

- `register(player: Address, name: String)`
- `complete_quest(player: Address, difficulty: u32, quest_name: Symbol/String)`
- `reset_streak(player: Address)`
- `get_profile(player: Address)`
- `get_total_players()`

## Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

Install Freighter, connect an account funded on Stellar Testnet, and switch
Freighter to Testnet before signing transactions.

## Environment Variables

```text
NEXT_PUBLIC_CONTRACT_ID=CC5TEK3IFXJGECTPJF3KFXVKWR44UDMDXBYPYVHEQ5KPIIXIIRQOHFZC
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
