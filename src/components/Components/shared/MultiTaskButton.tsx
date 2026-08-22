import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp, ActivityIndicator } from 'react-native';

interface MultiTaskButtonProps {
    title?: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    loading?: boolean;
}

function MultiTaskButton({ onPress, style , title, disabled, loading }: MultiTaskButtonProps) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style, (disabled || loading) && styles.disabled]} disabled={disabled || loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
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
    disabled: {
        opacity: 0.5,
    },
});

export default MultiTaskButton;