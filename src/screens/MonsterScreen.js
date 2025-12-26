import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, Animated, Alert } from 'react-native';
import { useGame, MONSTERS_POOL } from '../context/GameContext';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Coins, ShoppingBag, Gift } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_SIZE = (width - SPACING.md * 4) / COLUMN_COUNT;

const MonsterScreen = () => {
    const { coins, unlockedMonsters, unlockMonster } = useGame();
    const [isHatching, setIsHatching] = useState(false);
    const hatchAnim = useState(new Animated.Value(0))[0];

    const handleBuyEgg = () => {
        if (coins < 100) {
            Alert.alert("Not enough coins!", "Play more math games to earn 100 coins! 💰");
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
                Alert.alert("New Monster!", `You got a ${result.monster}! 🎉`);
            } else {
                Alert.alert("Oops!", result.message);
            }
        });
    };

    const renderMonster = ({ item }) => (
        <View style={styles.monsterCard}>
            <Text style={styles.monsterEmoji}>{item}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Monster Room</Text>
                <View style={styles.coinsBadge}>
                    <Coins color={COLORS.coins} size={24} />
                    <Text style={styles.coinsText}>{coins}</Text>
                </View>
            </View>

            <View style={styles.shopContainer}>
                <Animated.View style={{ transform: [{ translateX: hatchAnim }] }}>
                    <TouchableOpacity
                        style={[styles.eggButton, coins < 100 && styles.disabledEgg]}
                        onPress={handleBuyEgg}
                        disabled={isHatching}
                    >
                        <Gift color={COLORS.white} size={48} />
                        <Text style={styles.eggButtonText}>Buy Egg (100 💰)</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            <Text style={styles.subtitle}>Your Collection ({unlockedMonsters.length}/{MONSTERS_POOL.length})</Text>

            <FlatList
                data={unlockedMonsters}
                renderItem={renderMonster}
                keyExtractor={(item) => item}
                numColumns={COLUMN_COUNT}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.xl,
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
        padding: SPACING.md,
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        elevation: 5,
    },
    eggButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.lg,
        borderRadius: RADIUS.xl,
        alignItems: 'center',
        width: width * 0.7,
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
    },
    monsterCard: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        backgroundColor: COLORS.white,
        margin: SPACING.sm / 2,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        borderWidth: 2,
        borderColor: COLORS.pastelGreen,
    },
    monsterEmoji: {
        fontSize: 40,
    },
});

export default MonsterScreen;
