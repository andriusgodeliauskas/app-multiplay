import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { GameProvider, useGame } from './src/context/GameContext';
import MathScreen from './src/screens/MathScreen';
import MonsterScreen from './src/screens/MonsterScreen';
import { Calculator, Ghost } from 'lucide-react-native';
import { COLORS } from './src/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';

const Tab = createMaterialTopTabNavigator();

function MainNavigator() {
  const { t } = useGame();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#BDBDBD',
        tabBarIndicatorStyle: {
          backgroundColor: COLORS.primary,
          height: 4,
          borderRadius: 2,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 80,
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '900',
          textTransform: 'none',
        },
        tabBarShowIcon: true,
      }}
    >
      <Tab.Screen
        name="Math"
        component={MathScreen}
        options={{
          tabBarLabel: t.learnAndEarn,
          tabBarIcon: ({ color }) => <Calculator color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name="Monsters"
        component={MonsterScreen}
        options={{
          tabBarLabel: t.monsterRoom,
          tabBarIcon: ({ color }) => <Ghost color={color} size={20} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const maxAppWidth = 600;

  return (
    <SafeAreaProvider>
      <View style={[styles.outerContainer, isWeb && { backgroundColor: '#F0F4F8' }]}>
        <View style={[
          styles.innerContainer,
          isWeb && width > maxAppWidth && {
            width: maxAppWidth,
            alignSelf: 'center',
            marginVertical: 20,
            borderRadius: 30,
            overflow: 'hidden',
            elevation: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
          }
        ]}>
          <GameProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <MainNavigator />
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
  }
});
