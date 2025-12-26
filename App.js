import React from 'react';
// Version: 1.0.1 - Vercel Fix
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GameProvider } from './src/context/GameContext';
import MathScreen from './src/screens/MathScreen';
import MonsterScreen from './src/screens/MonsterScreen';
import { Calculator, Ghost } from 'lucide-react-native';
import { COLORS } from './src/constants/theme';
import { StatusBar } from 'expo-status-bar';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const maxAppWidth = 600; // Optimal tablet-like width for laptop screens

  return (
    <SafeAreaProvider>
      <View style={[styles.outerContainer, isWeb && { backgroundColor: '#E0F2F1' }]}>
        <View style={[
          styles.innerContainer,
          isWeb && width > maxAppWidth && { width: maxAppWidth, alignSelf: 'center', elevation: 20 }
        ]}>
          <GameProvider>

            <NavigationContainer>
              <StatusBar style="auto" />

              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 0,
                    elevation: 10,
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                  },
                  tabBarActiveTintColor: COLORS.primary,
                  tabBarInactiveTintColor: '#BDBDBD',
                  tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                  },
                }}
              >
                <Tab.Screen
                  name="Math"
                  component={MathScreen}
                  options={{
                    tabBarLabel: 'Learn & Earn',
                    tabBarIcon: ({ color, size }) => <Calculator color={color} size={size} />,
                  }}
                />
                <Tab.Screen
                  name="Monsters"
                  component={MonsterScreen}
                  options={{
                    tabBarLabel: 'Monster Room',
                    tabBarIcon: ({ color, size }) => <Ghost color={color} size={size} />,
                  }}
                />
              </Tab.Navigator>
            </NavigationContainer>
          </GameProvider>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  }
});

