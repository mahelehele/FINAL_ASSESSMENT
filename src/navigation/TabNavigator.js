import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExploreScreen from '../screens/Explore/ExploreScreen';
import BookingScreen from '../screens/Booking/BookingScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card },
      }}
    >
      <Tab.Screen 
        name="ExploreTab" 
        component={ExploreScreen} 
        options={{
          tabBarLabel: 'Explore',
          title: 'Explore'
        }}
      />
      <Tab.Screen 
        name="BookingsTab" 
        component={BookingScreen} 
        options={{
          tabBarLabel: 'Bookings',
          title: 'My Bookings'
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile',
          title: 'My Profile'
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;