import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, Animated, Alert } from 'react-native';
import { useGame, MONSTERS_POOL } from '../context/GameContext';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Coins, Gift } from 'lucide-react-native';

const { width: windowWidth } = Dimensions.get('window');
const COLUMN_COUNT = windowWidth > 500 ? 4 : 3;

const MonsterScreen = () => {
    const { coins, unlockedMonsters, unlockMonster, t } = useGame();
    const [isHatching, setIsHatching] = useState(false);
    const hatchAnim = useState(new Animated.Value(0))[0];

    const ITEM_SIZE = windowWidth > 600 ? 120 : (windowWidth - 60) / COLUMN_COUNT;

    const handleBuyEgg = () => {
        if (coins < 100) {
            Alert.alert(t.notEnoughCoins, t.playMore);
            return;
        }

        setIsHatching(true);
        Animated.sequence([
            Animated.timing(hatchAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(hatchAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
            Animated.timing(hatchAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(hatchAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
        ]).start(() => {
            const result = unlockMonster();
            setIsHatching(false);
            if (result.success) {
                Alert.alert(t.newMonster, `${result.monster}! 🎉`);
            } else {
                Alert.alert("Oops!", result.message);
            }
        });
    };

    const renderMonster = ({ item }) => (
        <View style={[styles.monsterCard, { width: ITEM_SIZE, height: ITEM_SIZE }]}>
            <Text style={[styles.monsterEmoji, { fontSize: ITEM_SIZE * 0.5 }]}>{item}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.bootstrapContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t.monsterRoom}</Text>
                    <View style={styles.coinsBadge}>
                        <Coins color={COLORS.coins} size={24} />
                        <Text style={styles.coinsText}>{coins}</Text>
                    </View>
                </View>

                <View style={styles.shopContainer}>
                    <Animated.View style={{ transform: [{ translateX: hatchAnim }] }}>
                        <TouchableOpacity
                            style={[
                                styles.eggButton,
                                coins < 100 && styles.disabledEgg,
                                { width: windowWidth > 400 ? 300 : '100%' }
                            ]}
                            onPress={handleBuyEgg}
                            disabled={isHatching}
                        >
                            <Gift color={COLORS.white} size={48} />
                            <Text style={styles.eggButtonText}>{t.buyEgg} (100 💰)</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <Text style={styles.subtitle}>{t.yourCollection} ({unlockedMonsters.length}/{MONSTERS_POOL.length})</Text>

                <FlatList
                    data={unlockedMonsters}
                    renderItem={renderMonster}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    numColumns={COLUMN_COUNT}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: 'center',
    },
    bootstrapContainer: {
        flex: 1,
        width: '100%',
        maxWidth: 600,
        paddingHorizontal: SPACING.md,
        paddingTop: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.secondary,
    },
    coinsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.full,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    coinsText: {
        marginLeft: 8,
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    shopContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
        padding: SPACING.lg,
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    eggButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.lg,
        borderRadius: RADIUS.xl,
        alignItems: 'center',
    },
    disabledEgg: {
        backgroundColor: '#CCC',
    },
    eggButtonText: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: '900',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    listContainer: {
        paddingBottom: SPACING.xl,
        alignItems: windowWidth > 500 ? 'flex-start' : 'center',
    },
    monsterCard: {
        backgroundColor: COLORS.white,
        margin: 8,
        borderRadius: RADIUS.lg,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 3,
        borderColor: COLORS.pastelGreen,
    },
    monsterEmoji: {
        textAlign: 'center',
    },
});

export default MonsterScreen;
