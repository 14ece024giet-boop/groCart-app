import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastContextData {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextData>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

// Global static reference to allow calling showToast without hook if needed
let globalToastRef: ((message: string, type?: ToastType, duration?: number) => void) | null = null;

export const showGlobalToast = (message: string, type: ToastType = 'info', duration = 3000) => {
  if (globalToastRef) {
    globalToastRef(message, type, duration);
  }
};

const { width } = Dimensions.get('window');

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('info');

  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, type: ToastType = 'info', duration = 3200) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToastMessage(message);
    setToastType(type);
    setVisible(true);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    timeoutRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  };

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  };

  globalToastRef = showToast;

  const getToastConfig = () => {
    switch (toastType) {
      case 'success':
        return {
          bgColor: '#059669',
          borderColor: '#10B981',
          icon: '✓',
          title: 'SUCCESS',
        };
      case 'error':
        return {
          bgColor: '#DC2626',
          borderColor: '#EF4444',
          icon: '⚠️',
          title: 'ERROR',
        };
      case 'warning':
        return {
          bgColor: '#B45309',
          borderColor: '#F59E0B',
          icon: '🔔',
          title: 'NOTICE',
        };
      case 'info':
      default:
        return {
          bgColor: '#0F172A',
          borderColor: '#334155',
          icon: 'ℹ️',
          title: 'INFO',
        };
    }
  };

  const config = getToastConfig();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.toastWrapper,
            {
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={hideToast}
            style={[
              styles.toastCard,
              { backgroundColor: config.bgColor, borderColor: config.borderColor },
            ]}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>{config.icon}</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.toastTitle}>{config.title}</Text>
              <Text style={styles.toastMessage}>{toastMessage}</Text>
            </View>

            <TouchableOpacity onPress={hideToast} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 9999,
    alignItems: 'center',
  },
  toastCard: {
    width: width - 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  toastTitle: {
    color: '#FACC15',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  toastMessage: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  closeBtn: {
    paddingLeft: 10,
    paddingVertical: 4,
  },
  closeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '900',
  },
});

export default ToastProvider;
