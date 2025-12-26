import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

export const MathGrid = ({ rows, cols }) => {
    // Auto-rotate if it's too tall (e.g., 12x4) and would fit better horizontally (4x12)
    const shouldRotate = rows > cols;
    const effectiveRows = shouldRotate ? cols : rows;
    const effectiveCols = shouldRotate ? rows : cols;

    const rowArray = Array.from({ length: effectiveRows });
    const colArray = Array.from({ length: effectiveCols });

    // Dynamic dot size based on columns AND rows
    const maxGridWidth = Math.min(windowWidth - 40, 600);
    const maxGridHeight = Math.min(windowHeight * 0.25, 180);

    // Calculate cell size that fits both dimensions
    const cellWidth = Math.floor(maxGridWidth / effectiveCols) - 2;
    const cellHeight = Math.floor(maxGridHeight / effectiveRows) - 2;

    // Choose the smaller one, cap at 20px
    const cellSize = Math.min(20, cellWidth, cellHeight);
    const dotSize = cellSize * 0.7;

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
        marginVertical: SPACING.md,
        alignSelf: 'center',
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
