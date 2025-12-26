import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useGame } from '../context/GameContext';
import { MathGrid } from '../components/MathGrid';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Coins, Star } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const MathScreen = () => {
    const { currentLevel, addCoins, updateLevel, coins } = useGame();
    const [problem, setProblem] = useState({ a: 0, b: 0, result: 0 });
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'
    const shakeAnimation = useState(new Animated.Value(0))[0];
    const scaleAnimation = useState(new Animated.Value(1))[0];

    const generateProblem = useCallback(() => {
        const a = currentLevel;
        const b = Math.floor(Math.random() * 10) + 1; // 1 to 10
        const result = a * b;

        // Generate wrong answers
        let wrong1 = result + (Math.floor(Math.random() * 3) + 1);
        let wrong2 = Math.max(0, result - (Math.floor(Math.random() * 3) + 1));

        if (wrong2 === result) wrong2 = result + 4;

        const allOptions = [result, wrong1, wrong2].sort(() => Math.random() - 0.5);

        setProblem({ a, b, result });
        setOptions(allOptions);
        setFeedback(null);
    }, [currentLevel]);

    useEffect(() => {
        generateProblem();
    }, [generateProblem]);

    const handleAnswer = (selected) => {
        if (selected === problem.result) {
            setFeedback('correct');
            addCoins(10);

            Animated.sequence([
                Animated.spring(scaleAnimation, { toValue: 1.2, useNativeDriver: true }),
                Animated.spring(scaleAnimation, { toValue: 1, useNativeDriver: true }),
            ]).start(() => {
                setTimeout(generateProblem, 1000);
            });
        } else {
            setFeedback('wrong');
            Animated.sequence([
                Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
            ]).start();

            // Still move forward after a delay? Or let them try again?
            // For kids, maybe show correct answer and move on
            setTimeout(generateProblem, 2000);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Practice Table</Text>
                    <View style={styles.levelSelector}>
                        {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
                            <TouchableOpacity
                                key={lvl}
                                onPress={() => updateLevel(lvl)}
                                style={[
                                    styles.levelButton,
                                    currentLevel === lvl && styles.levelButtonActive
                                ]}
                            >
                                <Text style={[
                                    styles.levelButtonText,
                                    currentLevel === lvl && styles.levelButtonTextActive
                                ]}>{lvl}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={styles.coinsBadge}>
                    <Coins color={COLORS.coins} size={24} />
                    <Text style={styles.coinsText}>{coins}</Text>
                </View>
            </View>

            <Animated.View style={[
                styles.gameArea,
                { transform: [{ translateX: shakeAnimation }, { scale: scaleAnimation }] }
            ]}>
                <Text style={styles.problemText}>
                    {problem.a} × {problem.b} = ?
                </Text>

                <MathGrid rows={problem.a} cols={problem.b} />

                {feedback === 'correct' && (
                    <View style={styles.feedbackOverlay}>
                        <Star color={COLORS.accent} size={64} fill={COLORS.accent} />
                        <Text style={styles.feedbackText}>EXCELLENT!</Text>
                    </View>
                )}

                {feedback === 'wrong' && (
                    <View style={styles.feedbackOverlay}>
                        <Text style={[styles.feedbackText, { color: COLORS.wrong }]}>
                            Oops! It was {problem.result}
                        </Text>
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
                            feedback === 'correct' && option === problem.result && styles.correctButton,
                            feedback === 'wrong' && option === problem.result && styles.correctButtonHighlight,
                        ]}
                        onPress={() => !feedback && handleAnswer(option)}
                        disabled={!!feedback}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>

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
        alignItems: 'flex-start',
        marginTop: SPACING.xl,
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.primary,
    },

    levelSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        maxWidth: width * 0.6,
    },
    levelButton: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginRight: 5,
        marginBottom: 5,
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
        fontWeight: 'bold',
        color: COLORS.text,
    },
    gameArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    problemText: {
        fontSize: 64, // Larger for big screens
        fontWeight: '900',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },

    feedbackOverlay: {
        position: 'absolute',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 20,
        borderRadius: 20,
        zIndex: 10,
    },
    feedbackText: {
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.correct,
        marginTop: 10,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: SPACING.xl,
    },
    optionButton: {
        backgroundColor: COLORS.white,
        width: 120, // Fixed larger size for touch
        height: 120,
        borderRadius: RADIUS.lg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 6,
        borderColor: COLORS.pastelBlue,
        elevation: 8,
        marginHorizontal: 10,
    },

    correctButton: {
        borderColor: COLORS.correct,
        backgroundColor: '#E8F5E9',
    },
    correctButtonHighlight: {
        borderColor: COLORS.correct,
        borderWidth: 6,
    },
    optionText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: COLORS.text,
    },

});

export default MathScreen;
