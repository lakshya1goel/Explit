import React, { useEffect } from 'react';
import { ActivityIndicator, Image, Keyboard, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import theme from '../../styles/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from 'react-native-snackbar';
import { login } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store';

const LoginScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch<AppDispatch>();
    const [credentials, setCredentials] = React.useState({
        email: '',
        password: '',
    });

    const { loading, isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            showSuccessMessage('Login Successful!');
            navigation.navigate('Home');
        }
    }, [isAuthenticated, navigation]);

    const showSuccessMessage = (message: string) => {
        Snackbar.show({
            text: message,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: 'green',
        });
    };

    const showErrorMessage = (message: string) => {
        Snackbar.show({
            text: message,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: 'red',
        });
    };

    const validateForm = (): boolean => {
        if (!credentials.email || !credentials.password) {
            showErrorMessage('Please enter both email and password');
            return false;
        }
        if (!credentials.email.includes('@')) {
            showErrorMessage('Please enter a valid email');
            return false;
        }
        if (credentials.password.length < 6) {
            showErrorMessage('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        try {
            if (!validateForm()) {return;}
            await dispatch(login(credentials)).unwrap();
        } catch (err) {
            if (typeof err === 'string') {
                showErrorMessage(err);
            } else if (err instanceof Error) {
                showErrorMessage(err.message);
            } else {
                showErrorMessage('Login failed');
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}><Text>home</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chat')}><Text>chat</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GroupSummary')}><Text>Summary</Text></TouchableOpacity>
            <Text style={styles.heading}>Login</Text>
            <Image source={require('../../../assets/images/explit_logo.png')} style={styles.logo} />
            <View style={styles.inputContainer}>
                <TextInput placeholder="Email"
                placeholderTextColor="#ABB5B5"
                value={credentials.email}
                onChangeText={(text) => setCredentials({ ...credentials, email: text })}
                style={{color: '#ffffff'}}/>
            </View>
            <View style={styles.inputContainer}>
                <TextInput placeholder="Password"
                placeholderTextColor="#ABB5B5"
                value={credentials.password}
                onChangeText={(text) => setCredentials({ ...credentials, password: text })}
                style={{color: '#ffffff'}}/>
            </View>
            {/* <TouchableOpacity style={styles.forotButton} onPress={() => navigation.navigate('VerifyMail')}>
                <Text style={styles.forgotText}>Forgot Password ?</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                    await handleLogin();
                    setCredentials({ email: '', password: '' });
                    Keyboard.dismiss();
                }}
                disabled={loading}
            >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text>Login</Text>
            )}
            </TouchableOpacity>
            <Text style={styles.accountText}>Don’t have an account ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.loginText}>Sign Up</Text>
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
    loginText: {
        color: theme.colors.primary[500],
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.02,
    },
});
export default LoginScreen;
