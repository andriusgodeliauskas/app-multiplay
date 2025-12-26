import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

export const MathGrid = ({ rows, cols }) => {
    const rowArray = Array.from({ length: rows });
    const colArray = Array.from({ length: cols });

    return (
        <View style={styles.container}>
            {rowArray.map((_, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.row}>
                    {colArray.map((_, colIndex) => (
                        <View key={`col-${colIndex}`} style={styles.dot} />
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING.md,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        borderWidth: 6,
        borderColor: COLORS.pastelBlue,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: SPACING.lg,
        alignSelf: 'center',
        minHeight: 180,
        minWidth: 180,
    },
    row: {
        flexDirection: 'row',
    },
    dot: {
        width: 30, // Larger dots for better visibility on laptop
        height: 30,
        borderRadius: 15,
        backgroundColor: COLORS.secondary,
        margin: 6,
    },
});

