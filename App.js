import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GameProvider } from './src/context/GameContext';
import MathScreen from './src/screens/MathScreen';
import MonsterScreen from './src/screens/MonsterScreen';
import { Calculator, Ghost } from 'lucide-react-native';
import { COLORS } from './src/constants/theme';
import { StatusBar } from 'expo-status-bar';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
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
  );
}
