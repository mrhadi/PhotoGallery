import * as React from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MainFlow } from './flow';

const MainStack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

function RootStack() {
  return (
    <NavigationContainer ref={navigationRef}>
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
