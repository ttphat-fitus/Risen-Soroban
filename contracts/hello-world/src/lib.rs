#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, String, Symbol,
};

#[contract]
pub struct StellarQuestContract;

#[contracttype]
#[derive(Clone)]
pub struct PlayerProfile {
    pub name: String,
    pub points: u32,
    pub level: u32,
    pub streak: u32,
    pub completed_quests: u32,
    pub title: Symbol,
}

#[contracttype]
pub enum DataKey {
    Player(Address),
    TotalPlayers,
}

#[contractimpl]
impl StellarQuestContract {
    pub fn register(env: Env, player: Address, name: String) -> PlayerProfile {
        player.require_auth();

        let key = DataKey::Player(player.clone());

        if env.storage().persistent().has(&key) {
            return env.storage().persistent().get(&key).unwrap();
        }

        let profile = PlayerProfile {
            name,
            points: 0,
            level: 1,
            streak: 0,
            completed_quests: 0,
            title: Symbol::new(&env, "ROOKIE"),
        };

        env.storage().persistent().set(&key, &profile);

        let total_key = DataKey::TotalPlayers;
        let total: u32 = env
            .storage()
            .instance()
            .get(&total_key)
            .unwrap_or(0);

        env.storage().instance().set(&total_key, &(total + 1));

        profile
    }

    pub fn complete_quest(
        env: Env,
        player: Address,
        difficulty: u32,
        quest_name: Symbol,
    ) -> PlayerProfile {
        player.require_auth();

        let key = DataKey::Player(player.clone());

        let mut profile: PlayerProfile = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or(PlayerProfile {
                name: String::from_str(&env, "anonymous"),
                points: 0,
                level: 1,
                streak: 0,
                completed_quests: 0,
                title: Symbol::new(&env, "ROOKIE"),
            });

        let reward = match difficulty {
            1 => 10,
            2 => 25,
            3 => 50,
            4 => 100,
            _ => 5,
        };

        profile.points += reward;
        profile.completed_quests += 1;
        profile.streak += 1;
        profile.level = 1 + profile.points / 100;

        profile.title = if profile.points >= 1000 {
            Symbol::new(&env, "LEGEND")
        } else if profile.points >= 500 {
            Symbol::new(&env, "MASTER")
        } else if profile.points >= 250 {
            Symbol::new(&env, "HUNTER")
        } else if profile.points >= 100 {
            Symbol::new(&env, "BUILDER")
        } else {
            Symbol::new(&env, "ROOKIE")
        };

        env.storage().persistent().set(&key, &profile);

        env.events().publish(
            (Symbol::new(&env, "QUEST"), player),
            (quest_name, reward, profile.points, profile.level),
        );

        profile
    }

    pub fn reset_streak(env: Env, player: Address) -> PlayerProfile {
        player.require_auth();

        let key = DataKey::Player(player.clone());

        let mut profile: PlayerProfile = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or(PlayerProfile {
                name: String::from_str(&env, "anonymous"),
                points: 0,
                level: 1,
                streak: 0,
                completed_quests: 0,
                title: Symbol::new(&env, "ROOKIE"),
            });

        profile.streak = 0;

        env.storage().persistent().set(&key, &profile);

        profile
    }

    pub fn get_profile(env: Env, player: Address) -> PlayerProfile {
        let key = DataKey::Player(player);

        env.storage()
            .persistent()
            .get(&key)
            .unwrap_or(PlayerProfile {
                name: String::from_str(&env, "anonymous"),
                points: 0,
                level: 1,
                streak: 0,
                completed_quests: 0,
                title: Symbol::new(&env, "ROOKIE"),
            })
    }

    pub fn get_total_players(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::TotalPlayers)
            .unwrap_or(0)
    }
}