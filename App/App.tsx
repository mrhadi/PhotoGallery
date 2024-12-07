import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootStack from './routing.tsx';

const App = () => {
  return (
    <SafeAreaProvider>
      <RootStack />
    </SafeAreaProvider>
  );
};

export default App;
