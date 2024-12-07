import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MainFlow } from './flow';

const MainStack = createNativeStackNavigator();

function RootStack() {
  return (
    <NavigationContainer>
      <MainStack.Navigator initialRouteName="MainFlow">
        <MainStack.Screen
          name="MainFlow"
          component={MainFlow}
          options={{ headerShown: false }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

export default RootStack;
