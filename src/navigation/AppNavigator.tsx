import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import SignUpScreen from '../screens/auth/SignUp';
import LoginScreen from '../screens/auth/Login';
import VerifyOtpScreen from '../screens/auth/VerfyOtp';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default AppNavigator;
