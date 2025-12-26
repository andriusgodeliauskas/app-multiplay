import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

export const MathGrid = ({ rows, cols }) => {
    const rowArray = Array.from({ length: rows });
    const colArray = Array.from({ length: cols });

    // Dynamic dot size based on columns AND rows
    // Max width/height to keep it "not static/too tall"
    const maxGridWidth = Math.min(windowWidth - 60, 500);
    const maxGridHeight = Math.min(windowHeight * 0.4, 400); // Max 40% of screen height

    // Calculate cell size that fits both dimensions
    const cellWidth = Math.floor(maxGridWidth / cols) - 4;
    const cellHeight = Math.floor(maxGridHeight / rows) - 4;

    // Choose the smaller one so it fits in both directions, but cap at 30px
    const cellSize = Math.min(30, cellWidth, cellHeight);
    const dotSize = cellSize * 0.75;

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
