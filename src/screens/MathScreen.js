import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView } from 'react-native';
import { useGame } from '../context/GameContext';
import { MathGrid } from '../components/MathGrid';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Coins, Star, Languages } from 'lucide-react-native';

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

        // Calculate potential reward based on difficulty (A + B)
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
                setTimeout(generateProblem, 1200);
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
        <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
            <View style={styles.bootstrapContainer}>
                {/* Utility Bar (Language & Coins) */}
                <View style={styles.utilityBar}>
                    <TouchableOpacity onPress={toggleLanguage} style={styles.langToggle}>
                        <Languages size={18} color={COLORS.secondary} />
                        <Text style={styles.langText}>{language.toUpperCase()}</Text>
                    </TouchableOpacity>

                    <View style={styles.coinsBadge}>
                        <Coins color={COLORS.coins} size={24} />
                        <Text style={styles.coinsText}>{coins}</Text>
                    </View>
                </View>

                {/* Level Selector */}
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

                <Animated.View style={[
                    styles.gameArea,
                    { transform: [{ translateX: shakeAnimation }, { scale: scaleAnimation }] }
                ]}>
                    <Text style={styles.problemText}>{problem.a} × {problem.b} = ?</Text>

                    {problem.reward > 0 && !feedback && (
                        <View style={styles.rewardIndicator}>
                            <Text style={styles.rewardText}>+{problem.reward}</Text>
                            <Coins size={20} color={COLORS.coins} fill={COLORS.coins} style={{ marginLeft: 4 }} />
                        </View>
                    )}

                    <MathGrid rows={problem.a} cols={problem.b} />


                    {feedback && (
                        <View style={styles.feedbackOverlay}>
                            {feedback.type === 'correct' ? (
                                <>
                                    <Star color={COLORS.accent} size={64} fill={COLORS.accent} />
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: SPACING.sm,
    },

    bootstrapContainer: {
        width: '100%',
        maxWidth: 600,
        paddingHorizontal: SPACING.md,
    },
    utilityBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: SPACING.md,
    },
    langToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        elevation: 2,
    },
    langText: {
        marginLeft: 4,
        fontSize: 14,
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
        fontWeight: 'bold',
        fontSize: 18,
        color: COLORS.text,
    },
    levelSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: SPACING.lg,
        justifyContent: 'center',
    },
    levelButton: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: RADIUS.md,
        margin: 3,
        minWidth: 40,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    levelButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    levelButtonText: {
        fontWeight: 'bold',
        color: COLORS.text,
    },
    levelButtonTextActive: {
        color: COLORS.white,
    },
    mixButton: {
        borderColor: COLORS.secondary,
        borderWidth: 2,
    },
    gameArea: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: SPACING.md,
    },
    problemText: {
        fontSize: 56, // Smaller
        fontWeight: '900',
        color: COLORS.text,
        marginBottom: 4,
    },

    rewardIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9C4', // Soft yellow
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 15,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: COLORS.coins,
    },
    rewardText: {
        fontSize: 20,
        fontWeight: '900',
        color: COLORS.text,
    },


    feedbackOverlay: {
        position: 'absolute',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 30,
        borderRadius: RADIUS.lg,
        zIndex: 10,
        width: '100%',
    },
    feedbackText: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.correct,
        marginTop: 10,
        textAlign: 'center',
    },
    coinsEarnedText: {
        fontSize: 32,
        fontWeight: '900',
        color: COLORS.coins,
        marginTop: 5,
    },

    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
        marginBottom: SPACING.xl,
    },
    optionButton: {
        backgroundColor: COLORS.white,
        width: windowWidth > 400 ? 100 : 80,
        height: windowWidth > 400 ? 100 : 80,
        borderRadius: RADIUS.lg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor: COLORS.pastelBlue,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

    correctButton: {
        borderColor: COLORS.correct,
        backgroundColor: '#E8F5E9',
    },
    correctButtonHighlight: {
        borderColor: COLORS.correct,
        borderWidth: 8,
    },
    optionText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: COLORS.text,
    },
});

export default MathScreen;
