import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LongButton from '../components/LongButton';


const { width } = Dimensions.get('window');

const WelcomeScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            {/* Background circles */}
            <View style={styles.circlesContainer}>
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
                <View style={[styles.circle, styles.circle3]} />
                <View style={[styles.circle, styles.circle4]} />
                <View style={[styles.circle, styles.circle5]} />
                <View style={[styles.circle, styles.circle6]} />
                <View style={[styles.circle, styles.circle7]} />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to Grocart</Text>
                <Text style={styles.subtitle}>
                    Let's first check that we{'\n'}deliver to your address
                </Text>
                <LongButton style={styles.signInButton} 
                                onPress={()=> navigation.navigate('SignIn')}
                                title='Sign IN' />
            </View>
        </View>
    );
};

const circleBase = {
    position: "absolute" as const,
    backgroundColor: '#fff',
    borderWidth: 6,
    borderColor: '#f3f3f3',
    opacity: 1,
    shadowColor: '#FF5A4D',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 16,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    circlesContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    circle: {
        ...circleBase,
        borderRadius: 100,
    },
    circle1: {
        width: 120,
        height: 120,
        top: 60,
        left: width * 0.1,
    },
    circle2: {
        width: 80,
        height: 80,
        top: 30,
        right: width * 0.1,
    },
    circle3: {
        width: 180,
        height: 180,
        top: 100,
        left: width * 0.25,
    },
    circle4: {
        width: 60,
        height: 60,
        top: 200,
        right: width * 0.15,
    },
    circle5: {
        width: 50,
        height: 50,
        top: 180,
        left: width * 0.05,
    },
    circle6: {
        width: 70,
        height: 70,
        top: 250,
        left: width * 0.6,
    },
    circle7: {
        width: 40,
        height: 40,
        top: 220,
        right: width * 0.25,
    },
    content: {
        zIndex: 1,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#b0b0b0',
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '500',
    },
    signInButton: {
        width: '100%',
        borderRadius: 8,
        backgroundColor: '#FF5A4D',
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF5A4D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
});

export default WelcomeScreen;