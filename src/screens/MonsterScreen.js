import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Animated, Alert, Platform } from 'react-native';
import { useGame, MONSTERS_POOL } from '../context/GameContext';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Coins, Lock, CheckCircle } from 'lucide-react-native';

const { width: windowWidth } = Dimensions.get('window');
const COLUMN_COUNT = windowWidth > 992 ? 6 : windowWidth > 768 ? 4 : 3;

const MonsterScreen = () => {
    const { coins, unlockedMonsterIds, buyMonster, t } = useGame();
    const [selectedMonster, setSelectedMonster] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const ITEM_SIZE = windowWidth > 992 ? 140 : windowWidth > 768 ? 120 : (windowWidth - 60) / COLUMN_COUNT;

    const handleBuyRequest = (monster) => {
        if (unlockedMonsterIds.includes(monster.id)) return;
        setSelectedMonster(monster);
        setModalVisible(true);
    };

    const confirmPurchase = () => {
        if (!selectedMonster) return;

        if (coins < selectedMonster.cost) {
            if (Platform.OS === 'web') {
                alert(`${t.notEnoughCoins}\\n${t.playMore}`);
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
                    { width: ITEM_SIZE, height: ITEM_SIZE + 50 },
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
            {/* Bootstrap-style Navbar */}
            <View style={styles.navbar}>
                <View style={styles.navbarContent}>
                    <Text style={styles.navbarBrand}>{t.monsterRoom}</Text>

                    <View style={styles.coinsBadge}>
                        <Coins color={COLORS.coins} size={20} />
                        <Text style={styles.coinsText}>{coins}</Text>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.mainContent}>
                    {/* Stats Card */}
                    <View style={styles.card}>
                        <Text style={styles.statsText}>
                            {unlockedMonsterIds.length} / {MONSTERS_POOL.length} {t.yourCollection}
                        </Text>
                    </View>

                    {/* Monsters Grid Card */}
                    <View style={styles.card}>
                        <View style={styles.gridContainer}>
                            {MONSTERS_POOL.map((monster) => (
                                <View key={monster.id} style={{ width: ITEM_SIZE, margin: 8 }}>
                                    {renderMonsterItem({ item: monster })}
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

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
        backgroundColor: '#F8F9FA',
    },
    navbar: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#DEE2E6',
        paddingVertical: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    navbarContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: windowWidth > 768 ? 40 : 16,
        maxWidth: 1200,
        width: '100%',
        alignSelf: 'center',
    },
    navbarBrand: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.primary,
    },
    coinsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3CD',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    coinsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#856404',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingVertical: 24,
    },
    mainContent: {
        maxWidth: 1200,
        width: '100%',
        alignSelf: 'center',
        paddingHorizontal: windowWidth > 768 ? 40 : 16,
        gap: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    statsText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6C757D',
        textAlign: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    monsterCard: {
        backgroundColor: '#F8F9FA',
        width: '100%', // Take full width of wrapper
        height: '100%', // Take full height
        borderRadius: 12,
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 2,
        borderColor: '#DEE2E6',
        paddingVertical: 12,
    },
    unlockedCard: {
        borderColor: COLORS.pastelGreen,
        backgroundColor: '#D4EDDA',
    },
    emojiContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    monsterEmoji: {
        textAlign: 'center',
    },
    lockedEmoji: {
        opacity: 0.2,
    },
    lockOverlay: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 20,
    },
    checkOverlay: {
        position: 'absolute',
        top: -10,
        right: -10,
    },
    priceTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        width: '90%',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#DEE2E6',
    },
    unlockedTag: {
        backgroundColor: COLORS.correct,
        borderColor: COLORS.correct,
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
        backgroundColor: '#FFFFFF',
        width: '90%',
        maxWidth: 400,
        padding: 32,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 20,
    },
    modalEmoji: {
        fontSize: 80,
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#212529',
        marginBottom: 16,
    },
    modalPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3CD',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        marginBottom: 24,
    },
    modalPriceText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#856404',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#6C757D',
    },
    confirmButton: {
        backgroundColor: COLORS.primary,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});

export default MonsterScreen;
