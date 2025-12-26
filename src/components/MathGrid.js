import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

const { width: windowWidth } = Dimensions.get('window');

export const MathGrid = ({ rows, cols }) => {
    const rowArray = Array.from({ length: rows });
    const colArray = Array.from({ length: cols });

    // Dynamic dot size based on columns and available width
    // Max width of container is 600, minus padding
    const maxGridWidth = Math.min(windowWidth - 40, 560);
    const cellSize = Math.min(35, Math.floor(maxGridWidth / cols) - 8);
    const dotSize = cellSize * 0.8;

    return (
        <View style={styles.container}>
            {rowArray.map((_, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.row}>
                    {colArray.map((_, colIndex) => (
                        <View
                            key={`col-${colIndex}`}
                            style={[
                                styles.dot,
                                {
                                    width: dotSize,
                                    height: dotSize,
                                    borderRadius: dotSize / 2,
                                    margin: (cellSize - dotSize) / 2 + 2
                                }
                            ]}
                        />
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
        // Responsive shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    row: {
        flexDirection: 'row',
    },
    dot: {
        backgroundColor: COLORS.secondary,
    },
});
