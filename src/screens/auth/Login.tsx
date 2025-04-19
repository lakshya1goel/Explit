import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import theme from '../../styles/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

const LoginScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Login</Text>
            <Image source={require('../../../assets/images/explit_logo.png')} style={styles.logo} />
            <View style={styles.inputContainer}>
                <TextInput placeholder="Email" placeholderTextColor="#ABB5B5"/>
            </View>
            <View style={styles.inputContainer}>
                <TextInput placeholder="Password" placeholderTextColor="#ABB5B5"/>
            </View>
            <TouchableOpacity style={styles.forotButton} onPress={() => navigation.navigate('VerifyOtp')}>
                <Text style={styles.forgotText}>Forgot Password ?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text>Login</Text>
            </TouchableOpacity>
            <Text style={styles.accountText}>Don’t have an account ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.logonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background[950],
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    logo: {
        width: 100,
        height: 100,
        margin: 20,
    },
    inputContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        width: '90%',
        backgroundColor: theme.colors.secondary[900],
        borderRadius: 4,
        marginBottom: 20,
    },
    button: {
        backgroundColor: theme.colors.primary[500],
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    forotButton: {
        alignSelf: 'flex-end',
        marginRight: 20,
    },
    forgotText: {
        color: theme.colors.secondary[300],
        marginTop: 10,
        marginBottom: 40,
        fontSize: 14,
        fontWeight: '400',
    },
    accountText: {
        color: theme.colors.secondary[400],
        marginTop: 25,
        marginBottom: 10,
        fontSize: 16,
        fontWeight: '400',
    },
    logonText: {
        color: theme.colors.primary[500],
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.02,
    },
});
export default LoginScreen;
