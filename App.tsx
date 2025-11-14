// App.tsx (replace entire file)
import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/app/store';
import RootNavigator from './src/navigation'; // <-- make sure this import exists (index.tsx)

import NetInfo from '@react-native-community/netinfo';
import { flushQueue } from './src/utils/syncQueue';

export default function App() {
  useEffect(() => {
    // Flush pending deletes when app opens
    flushQueue().catch(e => console.log('flush error', e));

    // Flush pending deletes whenever network reconnects
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        flushQueue().catch(e => console.log('flush error', e));
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
