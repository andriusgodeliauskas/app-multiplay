import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView } from 'react-native';
import { useGame } from '../context/GameContext';
import { MathGrid } from '../components/MathGrid';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Languages, Coins } from 'lucide-react-native';

const { width: windowWidth } = Dimensions.get('window');

const MathScreen = () => {
    const { currentLevel, addCoins, updateLevel, coins, language, toggleLanguage, t } = useGame();
    const [problem, setProblem] = useState({ a: 0, b: 0, result: 0 });
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const shakeAnimation = useState(new Animated.Value(0))[0];
    const scaleAnimation = useState(new Animated.Value(1))[0];

    const generateProblem = useCallback(() => {
        let a, b;
        if (currentLevel === 0) {
            a = Math.floor(Math.random() * 9) + 2;
            b = Math.floor(Math.random() * 11) + 1;
        } else {
            a = currentLevel;
            b = Math.floor(Math.random() * 12) + 1;
        }
        const displayA = Math.random() > 0.5 ? a : b;
        const displayB = displayA === a ? b : a;
        const result = a * b;

        let distractors = new Set();
        while (distractors.size < 2) {
            let offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
            let wrong = result + offset;
            if (wrong !== result && wrong > 0) distractors.add(wrong);
        }
        const allOptions = [result, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

        const difficulty = a + b;
        const potentialReward = Math.max(5, (difficulty - 3) * 5);

        setProblem({ a: displayA, b: displayB, result, reward: potentialReward });
        setOptions(allOptions);
        setFeedback(null);
    }, [currentLevel]);

    useEffect(() => {
        generateProblem();
    }, [generateProblem]);

    const handleAnswer = (selected) => {
        if (selected === problem.result) {
            const earnedCoins = problem.reward;

            setFeedback({ type: 'correct', amount: earnedCoins });
            addCoins(earnedCoins);

            Animated.sequence([
                Animated.spring(scaleAnimation, { toValue: 1.2, useNativeDriver: true }),
                Animated.spring(scaleAnimation, { toValue: 1, useNativeDriver: true }),
            ]).start(() => {
                setTimeout(generateProblem, 2500);
            });
        } else {
            setFeedback({ type: 'wrong' });
            Animated.sequence([
                Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
            ]).start();
            setTimeout(generateProblem, 2000);
        }
    };

    return (
        <View style={styles.container}>
            {/* Bootstrap-style Navbar */}
            <View style={styles.navbar}>
                <View style={styles.navbarContent}>
                    <Text style={styles.navbarBrand}>{t.learnAndEarn}</Text>

                    <View style={styles.navbarRight}>
                        <TouchableOpacity onPress={toggleLanguage} style={styles.langToggle}>
                            <Languages size={18} color="#6C757D" />
                            <Text style={styles.langText}>{language.toUpperCase()}</Text>
                        </TouchableOpacity>

                        <View style={styles.coinsBadge}>
                            <Coins color={COLORS.coins} size={20} />
                            <Text style={styles.coinsText}>{coins}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.mainContent}>
                    {/* Level Selector Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Pasirink lentelę</Text>
                        <View style={styles.levelSelector}>
                            {[0, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
                                <TouchableOpacity
                                    key={lvl}
                                    onPress={() => updateLevel(lvl)}
                                    style={[
                                        styles.levelButton,
                                        currentLevel === lvl && styles.levelButtonActive,
                                        lvl === 0 && styles.mixButton
                                    ]}
                                >
                                    <Text style={[
                                        styles.levelButtonText,
                                        currentLevel === lvl && styles.levelButtonTextActive
                                    ]}>{lvl === 0 ? 'Mix' : lvl}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Game Card */}
                    <View style={styles.card}>
                        <Animated.View style={[
                            styles.gameArea,
                            { transform: [{ translateX: shakeAnimation }, { scale: scaleAnimation }] }
                        ]}>
                            <Text style={styles.problemText}>{problem.a} × {problem.b} = ?</Text>

                            {problem.reward > 0 && !feedback && (
                                <View style={styles.rewardIndicator}>
                                    <Text style={styles.rewardText}>+{problem.reward}</Text>
                                    <Coins size={18} color={COLORS.coins} fill={COLORS.coins} style={{ marginLeft: 4 }} />
                                </View>
                            )}

                            <MathGrid rows={problem.a} cols={problem.b} />

                            {feedback && (
                                <View style={styles.feedbackOverlay}>
                                    {feedback.type === 'correct' ? (
                                        <>
                                            <Text style={styles.feedbackText}>{t.excellent}</Text>
                                            <Text style={styles.coinsEarnedText}>+{feedback.amount} 💰</Text>
                                        </>
                                    ) : (
                                        <Text style={[styles.feedbackText, { color: COLORS.wrong }]}>
                                            {t.oops} {problem.result}
                                        </Text>
                                    )}
                                </View>
                            )}
                        </Animated.View>

                        <View style={styles.optionsContainer}>
                            {options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.7}
                                    style={[
                                        styles.optionButton,
                                        feedback?.type === 'correct' && option === problem.result && styles.correctButton,
                                        feedback?.type === 'wrong' && option === problem.result && styles.correctButtonHighlight,
                                    ]}
                                    onPress={() => !feedback && handleAnswer(option)}
                                    disabled={!!feedback}
                                >
                                    <Text style={styles.optionText}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
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
    navbarRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    langToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        gap: 6,
    },
    langText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6C757D',
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
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#212529',
        marginBottom: 16,
    },
    levelSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
    },
    levelButton: {
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        minWidth: 50,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#DEE2E6',
    },
    levelButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    levelButtonText: {
        fontWeight: '700',
        fontSize: 16,
        color: '#495057',
    },
    levelButtonTextActive: {
        color: '#FFFFFF',
    },
    mixButton: {
        borderColor: COLORS.secondary,
    },
    gameArea: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    problemText: {
        fontSize: 52,
        fontWeight: '900',
        color: '#212529',
        marginBottom: 8,
    },
    rewardIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3CD',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#FFE69C',
    },
    rewardText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#856404',
    },
    feedbackOverlay: {
        marginTop: 16,
        alignItems: 'center',
    },
    feedbackText: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.correct,
        textAlign: 'center',
    },
    coinsEarnedText: {
        fontSize: 32,
        fontWeight: '900',
        color: COLORS.coins,
        marginTop: 8,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
        marginTop: 24,
    },
    optionButton: {
        backgroundColor: '#FFFFFF',
        width: windowWidth > 768 ? 120 : 100,
        height: windowWidth > 768 ? 120 : 100,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: COLORS.pastelBlue,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    correctButton: {
        borderColor: COLORS.correct,
        backgroundColor: '#D4EDDA',
    },
    correctButtonHighlight: {
        borderColor: COLORS.correct,
        borderWidth: 4,
    },
    optionText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text,
    },
});

export default MathScreen;
