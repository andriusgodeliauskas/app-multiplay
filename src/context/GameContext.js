import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRANSLATIONS } from '../constants/translations';

const GameContext = createContext();

export const MONSTERS_POOL = ['👾', '🦄', '🦖', '🐙', '🤖', '🦊', '🦁', '🐸', '🐼', '🐨', '🐯', '🐮', '🐷', '🐵', '🐣'];

export const GameProvider = ({ children }) => {
    const [coins, setCoins] = useState(0);
    const [unlockedMonsters, setUnlockedMonsters] = useState(['👾']);
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
            const savedMonsters = await AsyncStorage.getItem('@unlockedMonsters');
            const savedLevel = await AsyncStorage.getItem('@currentLevel');
            const savedLang = await AsyncStorage.getItem('@language');

            if (savedCoins !== null) setCoins(parseInt(savedCoins));
            if (savedMonsters !== null) setUnlockedMonsters(JSON.parse(savedMonsters));
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
            if (newMonsters) await AsyncStorage.setItem('@unlockedMonsters', JSON.stringify(newMonsters));
            if (newLevel !== undefined && newLevel !== null) await AsyncStorage.setItem('@currentLevel', newLevel.toString());
            if (newLang) await AsyncStorage.setItem('@language', newLang);
        } catch (e) {
            console.error('Failed to save game data', e);
        }
    };

    const addCoins = (amount) => {
        const nextCoins = coins + amount;
        setCoins(nextCoins);
        saveGameData(nextCoins, unlockedMonsters, currentLevel, language);
    };

    const toggleLanguage = () => {
        const nextLang = language === 'lt' ? 'en' : 'lt';
        setLanguage(nextLang);
        saveGameData(coins, unlockedMonsters, currentLevel, nextLang);
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
                saveGameData(nextCoins, nextMonsters, currentLevel, language);
                return { success: true, monster: randomMonster };
            }
            return { success: false, message: t.collectedAll };
        }
        return { success: false, message: t.notEnoughCoins };
    };

    const updateLevel = (newLevel) => {
        setCurrentLevel(newLevel);
        saveGameData(coins, unlockedMonsters, newLevel, language);
    };

    return (
        <GameContext.Provider value={{
            coins,
            unlockedMonsters,
            currentLevel,
            language,
            t,
            addCoins,
            unlockMonster,
            updateLevel,
            toggleLanguage,
            loading
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);
