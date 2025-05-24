import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import SignUpScreen from '../screens/auth/SignUp';
import LoginScreen from '../screens/auth/Login';
import VerifyMailScreen from '../screens/auth/VerfyMail';
import ResetPasswordScreen from '../screens/auth/ResetPassword';
// import HomeScreen from '../screens/Home';
import VerifyMobileScreen from '../screens/auth/VerifyMobile';
import ContactScreen from '../screens/Contact';
import ChatScreen from '../screens/Chat';
import GroupSummaryScreen from '../screens/GroupSummary';
import SplashScreen from '../screens/Splash';
import GroupScreen from '../screens/Groups';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="VerifyMail" component={VerifyMailScreen} />
                <Stack.Screen name="VerifyMobile" component={VerifyMobileScreen} />
                <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                <Stack.Screen name="Group" component={GroupScreen} />
                <Stack.Screen name="Contact" component={ContactScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="GroupSummary" component={GroupSummaryScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default AppNavigator;
