import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminDashboard from '../screens/AdminDashboard';
import ParentDashboard from '../screens/ParentDashboard';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = 'home';

            if (route.name === 'Admin') {
              iconName = 'settings';
            } else if (route.name === 'Parent') {
              iconName = 'people';
            }

            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2E7D32',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Admin" component={AdminDashboard} />
        <Tab.Screen name="Parent" component={ParentDashboard} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
