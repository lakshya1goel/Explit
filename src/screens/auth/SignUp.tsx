import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import theme from '../../styles/theme';

const SignUpScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Sign Up</Text>
            <Image source={require('../../../assets/images/explit_logo.png')} style={styles.logo} />
            <View style={styles.inputContainer}>
                <TextInput placeholder="Email" placeholderTextColor="#ABB5B5"/>
            </View>
            <View style={styles.inputContainer}>
                <TextInput placeholder="Password" placeholderTextColor="#ABB5B5"/>
            </View>
            <View style={styles.inputContainer}>
                <TextInput placeholder="Confirm Password" placeholderTextColor="#ABB5B5"/>
            </View>
            <TouchableOpacity style={styles.button}>
                <Text>Get Otp</Text>
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
});
export default SignUpScreen;
