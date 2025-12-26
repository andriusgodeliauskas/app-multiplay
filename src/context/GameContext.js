import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GameContext = createContext();

export const MONSTERS_POOL = ['👾', '🦄', '🦖', '🐙', '🤖', '🦊', '🦁', '🐸', '🐼', '🐨', '🐯', '🐮', '🐷', '🐵', '🐣'];

export const GameProvider = ({ children }) => {
    const [coins, setCoins] = useState(0);
    const [unlockedMonsters, setUnlockedMonsters] = useState(['👾']); // Start with one
    const [currentLevel, setCurrentLevel] = useState(2); // Start with multiplication by 2
    const [loading, setLoading] = useState(true);

    // Load data on mount
    useEffect(() => {
        loadGameData();
    }, []);

    const loadGameData = async () => {
        try {
            const savedCoins = await AsyncStorage.getItem('@coins');
            const savedMonsters = await AsyncStorage.getItem('@unlockedMonsters');
            const savedLevel = await AsyncStorage.getItem('@currentLevel');

            if (savedCoins !== null) setCoins(parseInt(savedCoins));
            if (savedMonsters !== null) setUnlockedMonsters(JSON.parse(savedMonsters));
            if (savedLevel !== null) setCurrentLevel(parseInt(savedLevel));
        } catch (e) {
            console.error('Failed to load game data', e);
        } finally {
            setLoading(false);
        }
    };

    const saveGameData = async (newCoins, newMonsters, newLevel) => {
        try {
            await AsyncStorage.setItem('@coins', newCoins.toString());
            await AsyncStorage.setItem('@unlockedMonsters', JSON.stringify(newMonsters));
            await AsyncStorage.setItem('@currentLevel', newLevel.toString());
        } catch (e) {
            console.error('Failed to save game data', e);
        }
    };

    const addCoins = (amount) => {
        const nextCoins = coins + amount;
        setCoins(nextCoins);
        saveGameData(nextCoins, unlockedMonsters, currentLevel);
    };

    const unlockMonster = () => {
        const cost = 100;
        if (coins >= cost) {
            const availableMonsters = MONSTERS_POOL.filter(m => !unlockedMonsters.includes(m));
            if (availableMonsters.length > 0) {
                const randomMonster = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
                const nextMonsters = [...unlockedMonsters, randomMonster];
                const nextCoins = coins - cost;
                setCoins(nextCoins);
                setUnlockedMonsters(nextMonsters);
                saveGameData(nextCoins, nextMonsters, currentLevel);
                return { success: true, monster: randomMonster };
            }
            return { success: false, message: "You collected them all!" };
        }
        return { success: false, message: "Not enough coins!" };
    };

    const updateLevel = (newLevel) => {
        setCurrentLevel(newLevel);
        saveGameData(coins, unlockedMonsters, newLevel);
    };

    return (
        <GameContext.Provider value={{
            coins,
            unlockedMonsters,
            currentLevel,
            addCoins,
            unlockMonster,
            updateLevel,
            loading
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);
