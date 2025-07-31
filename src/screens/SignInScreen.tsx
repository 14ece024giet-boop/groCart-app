import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation'; 
import LongButton from '../components/LongButton';

const { width } = Dimensions.get('window');

const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;
    const navigation = useNavigation<SignInScreenNavigationProp>();
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton}>
                <Text style={styles.backArrow}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Glad to see you!</Text>
            <Text style={styles.subtitle}>Login to access to Grocart</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email ID</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#b0b0b0"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    {email.length > 0 && (
                        <Text style={styles.checkIcon}>✔️</Text>
                    )}
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#b0b0b0"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <LongButton
                style={styles.signInButton}
                title="SIGN IN"
                onPress={() => navigation.navigate('Main')}
            />

            <TouchableOpacity style={styles.signUpContainer}>
                <Text style={styles.signUpText}>
                    Don't have an account ? <Text style={styles.signUpLink}>Sign Up</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingTop: 48,
    },
    backButton: {
        position: 'absolute',
        top: 48,
        left: 16,
        zIndex: 2,
    },
    backArrow: {
        fontSize: 28,
        color: '#222',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#222',
        marginTop: 16,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 15,
        color: '#b0b0b0',
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        color: '#b0b0b0',
        marginBottom: 4,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#222',
        paddingVertical: 10,
        fontWeight: 'bold',
    },
    checkIcon: {
        fontSize: 18,
        color: '#FF5A4D',
        marginLeft: 8,
    },
    eyeIcon: {
        fontSize: 18,
        color: '#b0b0b0',
        marginLeft: 8,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: '#222',
        fontSize: 13,
        fontWeight: '500',
    },
    signInButton: {
        width: '100%',
        borderRadius: 8,
        backgroundColor: '#FF5A4D',
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#FF5A4D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    signUpContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    signUpText: {
        color: '#222',
        fontSize: 14,
    },
    signUpLink: {
        color: '#FF5A4D',
        fontWeight: 'bold',
    },
});

export default SignInScreen;