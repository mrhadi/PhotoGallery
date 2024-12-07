import React, { useContext, useEffect } from 'react';
import { View, Text } from 'react-native';

import { MainFlowContext, MainFlowStateType } from '../flow';

function GIFBrowserScreen() {
  const mainFlow: MainFlowStateType = useContext(MainFlowContext);

  const gifData = mainFlow.getGIFData();
  console.log(gifData);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>GIF Browser</Text>
    </View>
  );
}

export default GIFBrowserScreen;
