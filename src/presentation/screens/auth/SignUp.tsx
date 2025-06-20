import React, { useEffect } from 'react';
import { ActivityIndicator, Image, Keyboard, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import theme from '../../../styles/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { register } from '../../../store/slices/authSlice';
import showSuccessMessage from '../../components/SuccessDialog';
import showErrorMessage from '../../components/ErrorDialog';

const SignUpScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch<AppDispatch>();
    const sendEmail = React.useRef<string>('');
    const sendMobile = React.useRef<string>('');
    const [credentials, setCredentials] = React.useState({
        email: '',
        mobile: '',
        password: '',
        confirm_password: '',
    });

    const { loading, isOtpSent } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isOtpSent) {
            showSuccessMessage('Registration Successful, please verify!');
            navigation.navigate('VerifyMail', {email: sendEmail.current, mobile: sendMobile.current});
        }
    }, [isOtpSent, navigation, sendEmail, sendMobile]);

    const validateForm = (): boolean => {
        if (!credentials.email || !credentials.mobile || !credentials.password || !credentials.confirm_password) {
            showErrorMessage('All fields are required');
            return false;
        }
        if (!credentials.email.includes('@')) {
            showErrorMessage('Please enter a valid email');
            return false;
        }
        if (credentials.mobile.length < 10) {
            showErrorMessage('Please enter a valid 10-digit mobile number');
            return false;
        }
        if (credentials.password.length < 6) {
            showErrorMessage('Password must be at least 6 characters');
            return false;
        }
        if (credentials.password.trim() !== credentials.confirm_password.trim()) {
            showErrorMessage('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        try {
            const trimmedCredentials = {
                email: credentials.email.trim(),
                mobile: credentials.mobile.trim().replace(/\D/g, '').slice(-10),
                password: credentials.password.trim(),
                confirm_password: credentials.confirm_password.trim(),
            };
            if (!validateForm()) { return; }
            await dispatch(register(trimmedCredentials)).unwrap();
        } catch (err) {
            if (typeof err === 'string') {
                showErrorMessage(err);
            } else if (err instanceof Error) {
                showErrorMessage(err.message);
            } else {
                showErrorMessage('Signup failed');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Sign Up</Text>
            <Image source={require('../../../../assets/images/explit_logo.png')} style={styles.logo} />
            <View style={styles.inputContainer}>
                <TextInput placeholder="Email"
                placeholderTextColor="#ABB5B5"
                value={credentials.email}
                onChangeText={(text) => setCredentials({ ...credentials, email: text })}
                style={{color: '#ffffff'}}/>
            </View>
            <View style={styles.inputContainer}>
                <TextInput placeholder="Mobile No."
                placeholderTextColor="#ABB5B5"
                value={credentials.mobile}
                onChangeText={(text) => setCredentials({ ...credentials, mobile: text })}
                style={{color: '#ffffff'}}/>
            </View>
            <View style={styles.inputContainer}>
                <TextInput placeholder="Password"
                placeholderTextColor="#ABB5B5"
                value={credentials.password}
                onChangeText={(text) => setCredentials({ ...credentials, password: text })}
                style={{color: '#ffffff'}}/>
            </View>
            <View style={styles.inputContainer}>
                <TextInput placeholder="Confirm Password"
                placeholderTextColor="#ABB5B5"
                value={credentials.confirm_password}
                onChangeText={(text) => setCredentials({ ...credentials, confirm_password: text })}
                style={{color: '#ffffff'}}/>
            </View>
            <TouchableOpacity style={styles.button}
            onPress={async () => {
                sendEmail.current = credentials.email;
                sendMobile.current = credentials.mobile;
                await handleRegister();
                setCredentials({ email: '', mobile: '', password: '', confirm_password: '' });
                Keyboard.dismiss();
            }}
            disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text>Get OTPs</Text>
                )}
            </TouchableOpacity>
            <Text style={styles.accountText}>Already have an account ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background[700],
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
    accountText: {
        color: theme.colors.secondary[400],
        marginTop: 25,
        marginBottom: 10,
        fontSize: 16,
        fontWeight: '400',
    },
    loginText: {
        color: theme.colors.primary[500],
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.02,
    },
});
export default SignUpScreen;
