import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { GameProvider, useGame } from './src/context/GameContext';
import MathScreen from './src/screens/MathScreen';
import MonsterScreen from './src/screens/MonsterScreen';
import Header from './src/components/Header';
import BackgroundMusic from './src/components/BackgroundMusic';
import { COLORS } from './src/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, Platform } from 'react-native';

const Tab = createMaterialTopTabNavigator();

function MainNavigator() {
  const { t } = useGame();

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <BackgroundMusic />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: '#6C757D',
          tabBarIndicatorStyle: {
            backgroundColor: COLORS.primary,
            height: 3,
          },
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 1,
            borderBottomColor: '#DEE2E6',
            height: 50,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
            textTransform: 'none',
          },
          tabBarShowIcon: false,
        }}
      >
        <Tab.Screen
          name="Math"
          component={MathScreen}
          options={{
            tabBarLabel: t.learnAndEarn,
          }}
        />

        <Tab.Screen
          name="Monsters"
          component={MonsterScreen}
          options={{
            tabBarLabel: t.monsterRoom,
          }}
        />

      </Tab.Navigator>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <MainNavigator />
        </NavigationContainer>
      </GameProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});

