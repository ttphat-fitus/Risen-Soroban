# Stellar Quest XP Contract

## Project Description

**Stellar Quest XP Contract** is a gamified smart contract built on the Stellar Testnet using Rust and the Soroban SDK.

The project turns blockchain learning activities into an on-chain achievement system. Each participant can register a player profile, complete quests, earn XP points, increase their level, build a streak, and receive a title based on their progress.

This contract is suitable for workshops, student communities, hackathons, learning platforms, or any environment where user progress and achievements should be tracked transparently on-chain.

## Core Features

### Player Registration (`register`)

Users can register their own on-chain player profile with a name.  
Each wallet address is mapped to one profile, and authentication is required to prevent unauthorized registration on behalf of another user.

### Quest Completion (`complete_quest`)

Players can complete quests with different difficulty levels.  
Each completed quest rewards XP points based on difficulty:

- Difficulty 1: 10 points
- Difficulty 2: 25 points
- Difficulty 3: 50 points
- Difficulty 4: 100 points
- Other values: 5 points

The contract automatically updates:

- Total points
- Completed quest count
- Streak
- Level
- Player title

### Level System

A player's level is calculated from their total points:

```text
Level = 1 + points / 100
```

This makes progress simple, transparent, and easy to verify on-chain.

### Dynamic Player Titles

Players receive titles based on their accumulated points:

- `ROOKIE`
- `BUILDER`
- `HUNTER`
- `MASTER`
- `LEGEND`

This creates a simple achievement system for motivating users to keep completing quests.

### Streak Tracking (`reset_streak`)

The contract tracks a player's quest streak.  
A player can reset their streak when needed, while keeping their points, level, and completed quest history.

### Read-Only Profile Query (`get_profile`)

Anyone can query a player's profile using their address.

The returned profile includes:

- Name
- Points
- Level
- Streak
- Completed quests
- Title

### Total Player Count (`get_total_players`)

The contract stores and returns the total number of registered players.

### Event Logging

When a quest is completed, the contract emits an on-chain event containing:

- Quest name
- Reward amount
- Updated total points
- Updated level

This improves transparency and makes the contract easier to index or connect to a future frontend.

## Contract Link

Contract on Stellar Lab (Testnet):  
https://lab.stellar.org/r/testnet/contract/CC5TEK3IFXJGECTPJF3KFXVKWR44UDMDXBYPYVHEQ5KPIIXIIRQOHFZC

## Interaction Screenshots

Add screenshots of the following actions before submitting:

- Successful contract deployment
- Successful `register` invocation
- Successful `complete_quest` invocation
- Successful `get_profile` result

Example filenames:

- `screenshot_deploy.png`
- `screenshot_register.png`
- `screenshot_complete_quest.png`
- `screenshot_get_profile.png`

## How to Build

```bash
stellar contract build
```

## How to Deploy

```bash
stellar contract deploy --wasm /app/target/wasm32v1-none/release/hello_world.wasm --source-account alice --network testnet --alias stellar-quest
```

## Example Interactions

### Register a player

```bash
stellar contract invoke --id CC5TEK3IFXJGECTPJF3KFXVKWR44UDMDXBYPYVHEQ5KPIIXIIRQOHFZC --source-account alice --network testnet -- register --player alice --name Phat
```

### Complete a quest

```bash
stellar contract invoke --id CC5TEK3IFXJGECTPJF3KFXVKWR44UDMDXBYPYVHEQ5KPIIXIIRQOHFZC --source-account alice --network testnet -- complete_quest --player alice --difficulty 3 --quest_name build
```

### Get player profile

```bash
stellar contract invoke --id CC5TEK3IFXJGECTPJF3KFXVKWR44UDMDXBYPYVHEQ5KPIIXIIRQOHFZC --source-account alice --network testnet -- get_profile --player alice
```

### Get total players

```bash
stellar contract invoke --id CC5TEK3IFXJGECTPJF3KFXVKWR44UDMDXBYPYVHEQ5KPIIXIIRQOHFZC --source-account alice --network testnet -- get_total_players
```

## Future Scope

### Frontend Integration

Build a React.js frontend and integrate it with Freighter Wallet so users can register profiles and complete quests without using terminal commands.

### NFT Achievement Badges

Extend the project to issue NFT-style achievement badges when players reach milestones such as `BUILDER`, `MASTER`, or `LEGEND`.

### Admin-Created Quest System

Add admin functionality to create official quests with fixed names, rewards, and difficulty levels.

### Leaderboard

Create a leaderboard that ranks players by points, level, completed quests, and streak.

### Educational Platform Integration

Use the contract as a progress-tracking layer for blockchain courses, university clubs, hackathons, or Build on Stellar learning programs.

## Author Profile

- Full Name: Trịnh Tấn Phát
- Role: Student
- GitHub: https://github.com/ttphat-fitus
