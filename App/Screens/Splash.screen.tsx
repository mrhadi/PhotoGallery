import React, { useContext, useEffect } from 'react';
import { View, Text } from 'react-native';

import { MainFlowContext, MainFlowStateType } from '../flow';

function SplashScreen() {
  const mainFlow: MainFlowStateType = useContext(MainFlowContext);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      mainFlow.onSplashScreenDone();
    }, 2000);

    return () => clearTimeout(timeoutId);
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Photo Gallery</Text>
    </View>
  );
}

export default SplashScreen;
