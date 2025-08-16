import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface LongButtonProps {
    title?: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
}

function LongButton({ onPress, style , title }: LongButtonProps) {
    return (
        console.log('SignInButton rendered', onPress, style),
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        // Default styles can be empty or set here
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});

export default LongButton;