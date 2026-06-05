import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. IMPORT ALL YOUR SCREENS
import OnboardingScreen from './PG/OnboardingScreen';
import HomeScreen from './PG/HomeScreen';
import AddTransactionScreen from './PG/AddTransactionScreen';
import WalletScreen from './PG/WalletScreen';
import AddCardScreen from './PG/AddCardScreen';
import EditCardScreen from './PG/EditCardScreen';
import SettingsScreen from './PG/SettingsScreen';
import ProfileScreen from './PG/ProfileScreen';
import SearchScreen from './PG/SearchScreen';
import StatisticsScreen from './PG/StatisticsScreen'; 
import AllTransactionsScreen from './PG/AllTransactionsScreen'; 

// Import Theme
import { ThemeProvider } from './PG/ThemeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="AddCard" component={AddCardScreen} />
          <Stack.Screen name="EditCard" component={EditCardScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
          <Stack.Screen name="AllTransactions" component={AllTransactionsScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
