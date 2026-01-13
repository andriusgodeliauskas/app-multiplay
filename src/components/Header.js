import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native';
import { Volume2, VolumeX, Coins } from 'lucide-react-native';
import { useGame } from '../context/GameContext';
import { COLORS, SPACING } from '../constants/theme';

const Header = () => {
  const { coins, musicOn, toggleMusic } = useGame();

  return (
    <View style={styles.headerWrapper}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.coinContainer}>
            <View style={styles.iconCircle}>
              <Coins size={20} color={COLORS.coins} fill={COLORS.coins} />
            </View>
            <Text style={styles.coinText}>{coins}</Text>
          </View>
          
          <Text style={styles.title}>MultiPlay</Text>

          <TouchableOpacity 
            onPress={toggleMusic} 
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            {musicOn ? (
              <Volume2 size={24} color={COLORS.primary} />
            ) : (
              <VolumeX size={24} color="#6C757D" />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DEE2E6',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  iconCircle: {
    marginRight: 6,
  },
  coinText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
});

export default Header;
