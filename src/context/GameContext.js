import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRANSLATIONS } from '../constants/translations';

const GameContext = createContext();

export const MONSTERS_POOL = [
    { id: 'm1', emoji: '👾', cost: 50 },
    { id: 'm2', emoji: '🦖', cost: 100 },
    { id: 'm3', emoji: '🤖', cost: 150 },
    { id: 'm4', emoji: '🐙', cost: 200 },
    { id: 'm5', emoji: '🦄', cost: 250 },
    { id: 'm6', emoji: '🦊', cost: 300 },
    { id: 'm7', emoji: '🦁', cost: 350 },
    { id: 'm8', emoji: '🐸', cost: 400 },
    { id: 'm9', emoji: '🐼', cost: 450 },
    { id: 'm10', emoji: '🐨', cost: 500 },
    { id: 'm11', emoji: '🐯', cost: 550 },
    { id: 'm12', emoji: '🐮', cost: 600 },
    { id: 'm13', emoji: '🐷', cost: 650 },
    { id: 'm14', emoji: '🐵', cost: 700 },
    { id: 'm15', emoji: '🐣', cost: 800 },
    { id: 'm16', emoji: '🐉', cost: 1000 },
    { id: 'm17', emoji: '🦒', cost: 1200 },
    { id: 'm18', emoji: '🦩', cost: 1500 },
];

export const GameProvider = ({ children }) => {
    const [coins, setCoins] = useState(0);
    const [unlockedMonsterIds, setUnlockedMonsterIds] = useState(['m1']);
    const [currentLevel, setCurrentLevel] = useState(2);
    const [language, setLanguage] = useState('lt');
    const [loading, setLoading] = useState(true);

    const t = TRANSLATIONS[language] || TRANSLATIONS.en;

    // Load data on mount
    useEffect(() => {
        loadGameData();
    }, []);

    const loadGameData = async () => {
        try {
            const savedCoins = await AsyncStorage.getItem('@coins');
            const savedMonsters = await AsyncStorage.getItem('@unlockedMonsterIds');
            const savedLevel = await AsyncStorage.getItem('@currentLevel');
            const savedLang = await AsyncStorage.getItem('@language');

            if (savedCoins !== null) setCoins(parseInt(savedCoins));
            if (savedMonsters !== null) setUnlockedMonsterIds(JSON.parse(savedMonsters));
            if (savedLevel !== null) setCurrentLevel(parseInt(savedLevel));
            if (savedLang !== null) setLanguage(savedLang);
        } catch (e) {
            console.error('Failed to load game data', e);
        } finally {
            setLoading(false);
        }
    };

    const saveGameData = async (newCoins, newMonsters, newLevel, newLang) => {
        try {
            if (newCoins !== undefined && newCoins !== null) await AsyncStorage.setItem('@coins', newCoins.toString());
            if (newMonsters) await AsyncStorage.setItem('@unlockedMonsterIds', JSON.stringify(newMonsters));
            if (newLevel !== undefined && newLevel !== null) await AsyncStorage.setItem('@currentLevel', newLevel.toString());
            if (newLang) await AsyncStorage.setItem('@language', newLang);
        } catch (e) {
            console.error('Failed to save game data', e);
        }
    };

    const addCoins = (amount) => {
        const nextCoins = coins + amount;
        setCoins(nextCoins);
        saveGameData(nextCoins);
    };

    const toggleLanguage = () => {
        const nextLang = language === 'lt' ? 'en' : 'lt';
        setLanguage(nextLang);
        saveGameData(null, null, null, nextLang);
    };

    const buyMonster = (monsterId) => {
        const monster = MONSTERS_POOL.find(m => m.id === monsterId);
        if (!monster) return { success: false, message: "Error" };

        if (unlockedMonsterIds.includes(monsterId)) {
            return { success: false, message: "Already unlocked" };
        }

        if (coins >= monster.cost) {
            const nextCoins = coins - monster.cost;
            const nextMonsters = [...unlockedMonsterIds, monsterId];
            setCoins(nextCoins);
            setUnlockedMonsterIds(nextMonsters);
            saveGameData(nextCoins, nextMonsters);
            return { success: true, monster: monster.emoji };
        }
        return { success: false, message: t.notEnoughCoins };
    };

    const updateLevel = (newLevel) => {
        setCurrentLevel(newLevel);
        saveGameData(null, null, newLevel);
    };

    return (
        <GameContext.Provider value={{
            coins,
            unlockedMonsterIds,
            currentLevel,
            language,
            t,
            addCoins,
            buyMonster,
            updateLevel,
            toggleLanguage,
            loading
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);
