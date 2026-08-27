import { StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './src/store';
import { Provider } from 'react-redux';
import { ToastProvider } from './src/components/Toast/ToastContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ToastProvider>
          <AppNavigator />
        </ToastProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
