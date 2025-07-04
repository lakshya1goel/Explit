import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import SignUpScreen from '../presentation/screens/auth/SignUp';
import LoginScreen from '../presentation/screens/auth/Login';
import VerifyMailScreen from '../presentation/screens/auth/VerfyMail';
import ResetPasswordScreen from '../presentation/screens/auth/ResetPassword';
import VerifyMobileScreen from '../presentation/screens/auth/VerifyMobile';
import ContactScreen from '../presentation/screens/Contact';
import ChatScreen from '../presentation/screens/Chat';
import GroupSummaryScreen from '../presentation/screens/GroupSummary';
import SplashScreen from '../presentation/screens/auth/Splash';
import GroupScreen from '../presentation/screens/Groups';
import SplitExpenseScreen from '../presentation/screens/Split';
import HomeScreen from '../presentation/screens/Home';
import PersonalExpenseScreen from '../presentation/screens/PersonalExpense';
import CreatePersonalExpenseScreen from '../presentation/screens/CreatePersonalExpense';
import InviteScreen from '../presentation/screens/InvitationScreen';

const Stack = createStackNavigator<RootStackParamList>();

const linking = {
    prefixes: ['explit://', 'https://explit.com'],
    config: {
        screens: {
            Invite: 'invite',
        },
    },
};


const AppNavigator = () => {
    return (
        <NavigationContainer linking={linking}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="VerifyMail" component={VerifyMailScreen} />
                <Stack.Screen name="VerifyMobile" component={VerifyMobileScreen} />
                <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Group" component={GroupScreen} />
                <Stack.Screen name="Contact" component={ContactScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="SplitExpense" component={SplitExpenseScreen} />
                <Stack.Screen name="GroupSummary" component={GroupSummaryScreen} />
                <Stack.Screen name="PersonalExpense" component={PersonalExpenseScreen} />
                <Stack.Screen name="CreatePersonalExpense" component={CreatePersonalExpenseScreen} />
                <Stack.Screen name="Invite" component={InviteScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default AppNavigator;
