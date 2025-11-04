import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import SignIn from '../screens/Auth/SignIn';
import SignUp from '../screens/Auth/SignUp';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import AddReview from '../screens/Reviews/AddReview';
import HotelDetail from '../screens/Explore/HotelDetail';
import BookingScreen from '../screens/Booking/BookingScreen';
import TabNavigator from './TabNavigator';
import colors from '../theme/colors';

const Stack = createStackNavigator();

const AppStack = ({ firstLaunch, isLoggedIn }) => {
  return (
    <Stack.Navigator 
      initialRouteName={isLoggedIn ? "MainApp" : (firstLaunch ? "Onboarding" : "SignIn")}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          // use theme primary color
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Auth Screens */}
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SignIn" 
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPassword}
        options={{ headerTitle: "Forgot Password" }}
      />

      {/* Main App Screens */}
      <Stack.Screen 
        name="HotelDetail"
        component={HotelDetail}
        options={{ headerTitle: 'Hotel Detail' }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ headerTitle: 'Booking' }}
      />
      <Stack.Screen 
        name="MainApp" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      {/* Modal Screens */}
      <Stack.Screen 
        name="AddReview" 
        component={AddReview}
        options={{ 
          headerTitle: "Write a Review",
          presentation: 'modal'
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;