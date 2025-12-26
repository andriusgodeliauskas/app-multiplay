import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, Animated, Alert, ScrollView, Platform } from 'react-native';
import { useGame, MONSTERS_POOL } from '../context/GameContext';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Coins, Lock, CheckCircle } from 'lucide-react-native';

const { width: windowWidth } = Dimensions.get('window');
const COLUMN_COUNT = windowWidth > 500 ? 4 : 3;

const MonsterScreen = () => {
    const { coins, unlockedMonsterIds, buyMonster, t } = useGame();
    const [hatchAnim] = useState(new Animated.Value(0));

    const [selectedMonster, setSelectedMonster] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const ITEM_SIZE = windowWidth > 600 ? 120 : (windowWidth - 60) / COLUMN_COUNT;

    const handleBuyRequest = (monster) => {
        if (unlockedMonsterIds.includes(monster.id)) return;
        setSelectedMonster(monster);
        setModalVisible(true);
    };

    const confirmPurchase = () => {
        if (!selectedMonster) return;

        if (coins < selectedMonster.cost) {
            if (Platform.OS === 'web') {
                alert(`${t.notEnoughCoins}\n${t.playMore}`);
            } else {
                Alert.alert(t.notEnoughCoins, t.playMore);
            }
            setModalVisible(false);
            return;
        }

        const result = buyMonster(selectedMonster.id);
        if (result.success) {
            setModalVisible(false);
            setSelectedMonster(null);
        } else {
            if (Platform.OS === 'web') {
                alert(result.message);
            } else {
                Alert.alert("Oops!", result.message);
            }
        }
    };


    const renderMonsterItem = ({ item: monster }) => {
        const isUnlocked = unlockedMonsterIds.includes(monster.id);

        return (
            <TouchableOpacity
                style={[
                    styles.monsterCard,
                    { width: ITEM_SIZE, height: ITEM_SIZE + 40 },
                    isUnlocked && styles.unlockedCard
                ]}
                onPress={() => handleBuyRequest(monster)}

                activeOpacity={isUnlocked ? 1 : 0.7}
            >
                <View style={styles.emojiContainer}>
                    <Text style={[
                        styles.monsterEmoji,
                        { fontSize: ITEM_SIZE * 0.45 },
                        !isUnlocked && styles.lockedEmoji
                    ]}>
                        {monster.emoji}
                    </Text>
                    {!isUnlocked && (
                        <View style={styles.lockOverlay}>
                            <Lock size={20} color={COLORS.white} />
                        </View>
                    )}
                    {isUnlocked && (
                        <View style={styles.checkOverlay}>
                            <CheckCircle size={20} color={COLORS.correct} fill={COLORS.white} />
                        </View>
                    )}
                </View>

                <View style={[styles.priceTag, isUnlocked && styles.unlockedTag]}>
                    <Text style={styles.priceText}>
                        {isUnlocked ? t.unlocked : `${monster.cost}`}
                    </Text>

                    {!isUnlocked && <Coins size={12} color={COLORS.coins} style={{ marginLeft: 2 }} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.bootstrapContainer}>
                <View style={styles.header}>
                    <View style={styles.coinsBadge}>
                        <Coins color={COLORS.coins} size={24} />
                        <Text style={styles.coinsText}>{coins}</Text>
                    </View>
                </View>

                <Text style={styles.subtitle}>{t.monsterRoom}</Text>
                <Text style={styles.collectionInfo}>
                    {unlockedMonsterIds.length} / {MONSTERS_POOL.length} {t.yourCollection}
                </Text>

                <FlatList
                    data={MONSTERS_POOL}
                    renderItem={renderMonsterItem}
                    keyExtractor={(item) => item.id}
                    numColumns={COLUMN_COUNT}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            {/* Custom Purchase Modal */}
            {modalVisible && selectedMonster && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalEmoji}>{selectedMonster.emoji}</Text>
                        <Text style={styles.modalTitle}>{t.buyEgg}?</Text>

                        <View style={styles.modalPriceContainer}>
                            <Text style={styles.modalPriceText}>{selectedMonster.cost}</Text>
                            <Coins size={24} color={COLORS.coins} fill={COLORS.coins} style={{ marginLeft: 4 }} />
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>{t.no}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={confirmPurchase}
                            >
                                <Text style={styles.confirmButtonText}>{t.yes}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginVertical: SPACING.md,
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
    subtitle: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.primary,
        textAlign: 'center',
    },
    collectionInfo: {
        fontSize: 16,
        color: COLORS.secondary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
        fontWeight: '600',
    },
    listContainer: {
        paddingBottom: SPACING.xl,
        alignItems: 'center',
    },
    monsterCard: {
        backgroundColor: COLORS.white,
        margin: 8,
        borderRadius: RADIUS.lg,
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 2,
        borderColor: COLORS.border,
        paddingVertical: 10,
    },
    unlockedCard: {
        borderColor: COLORS.pastelGreen,
        backgroundColor: '#F1F8E9',
    },
    emojiContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    monsterEmoji: {
        textAlign: 'center',
    },
    lockedEmoji: {
        opacity: 0.2, // Silhouette effect
        tintColor: '#000',
    },
    lockOverlay: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: RADIUS.full,
    },
    checkOverlay: {
        position: 'absolute',
        top: -15,
        right: -15,
    },
    priceTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: RADIUS.md,
        width: '80%',
        justifyContent: 'center',
    },
    unlockedTag: {
        backgroundColor: COLORS.correct,
    },
    priceText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    // Modal Styles
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: COLORS.white,
        width: '85%',
        maxWidth: 400,
        padding: 30,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    modalEmoji: {
        fontSize: 80,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.text,
        marginBottom: 10,
    },
    modalPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginBottom: 30,
    },
    modalPriceText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        marginRight: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 20,
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 20,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#EEEEEE',
    },
    confirmButton: {
        backgroundColor: COLORS.primary,
    },
    cancelButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666666',
    },
    confirmButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
    },
});


export default MonsterScreen;
