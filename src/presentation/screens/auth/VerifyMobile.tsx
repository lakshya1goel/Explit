import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native';
import theme from '../../../styles/theme';
import { TextInput } from 'react-native-gesture-handler';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { verifyMobile } from '../../../store/slices/authSlice';
import AuthService from '../../../services/AuthService';
import showErrorMessage from '../../components/ErrorDialog';
import showSuccessMessage from '../../components/SuccessDialog';

const VerifyMobileScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'VerifyMail'>>();
    const {mobile} = route.params;
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch<AppDispatch>();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<Array<TextInput | null>>(new Array(6).fill(null));

    const { loading, isMobileVerified, accessToken, refreshToken} = useSelector((state: RootState) => state.auth);
    console.log(mobile);

    useEffect(() => {
        if (isMobileVerified && accessToken && refreshToken) {
            const saveTokens = async () => {
                try {
                    const accessExpTime = new Date();
                    accessExpTime.setDate(accessExpTime.getDate() + 1);
                    const refreshExpTime = new Date();
                    refreshExpTime.setDate(refreshExpTime.getDate() + 30);
                    await AuthService.storeToken({
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        accessExpTime: accessExpTime.getTime(),
                        refreshExpTime: refreshExpTime.getTime(),
                    });
                    showSuccessMessage('Mobile Verified!');
                    navigation.navigate('Group');
                } catch (error) {
                    showErrorMessage('Failed to save authentication tokens');
                }
            };
            saveTokens();
        }
    }, [isMobileVerified, navigation, accessToken, refreshToken]);

    const handleVerifyMobile = async () => {
        try {
            const otpString = otp.join('');
            if (otpString.length !== 6) {
                showErrorMessage('Please enter complete OTP');
                return;
            }

            await dispatch(verifyMobile({ mobile, otp: otpString })).unwrap();
        } catch (err) {
            if (typeof err === 'string') {
                showErrorMessage(err);
            } else if (err instanceof Error) {
                showErrorMessage(err.message);
            } else {
                showErrorMessage('Verification failed');
            }
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        if (value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value.length === 1 && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
            inputRefs.current[index - 1]?.focus();
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Verify Mobile Number</Text>
            <Image source={require('../../../assets/images/explit_logo.png')} style={styles.logo} />
            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(el: TextInput | null) => {
                            inputRefs.current[index] = el;
                        }}
                        style={styles.otpInput}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                        caretHidden={true}
                    />
                ))}
            </View>
            <Text style={styles.text}>An OTP is send to your e-mail.</Text>
            {/* <Text style={styles.text}>Didn’t receive an OTP ? </Text>
            <Text style={styles.text}>Resend in 5:00 mins</Text> */}
            <TouchableOpacity style={styles.button}
            onPress={async () => {
                await handleVerifyMobile();
                Keyboard.dismiss();
            }}
            disabled={loading}>
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text>Verify</Text>
            )}
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
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 4,
        marginTop: 20,
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    otpInput: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: theme.colors.secondary[900],
        textAlign: 'center',
        fontSize: 24,
        color: '#ffffff',
        paddingTop: 0,
        paddingBottom: 0,
    },
    button: {
        backgroundColor: theme.colors.primary[500],
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        marginTop: 50,
    },
    text: {
        color: theme.colors.secondary[200],
        marginBottom: 8,
        fontSize: 16,
        fontWeight: '400',
    },
});
export default VerifyMobileScreen;
