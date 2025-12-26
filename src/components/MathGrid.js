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
        borderRadius: 20,
        borderWidth: 4,
        borderColor: COLORS.pastelBlue,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: SPACING.lg,
        alignSelf: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.secondary,
        margin: 4,
    },
});
