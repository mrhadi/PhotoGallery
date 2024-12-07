import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GIFBrowserScreen from './Screens/GIFBrowser.screen';
import SplashScreen from './Screens/Splash.screen';

import ApiService from './Services/api';

export type MainFlowStateType = {
  onSplashScreenDone: Function
}

const MainFlowNavigationStack = createNativeStackNavigator();

export const MainFlowContext = React.createContext<MainFlowStateType | null>(
  null
);

const MainFlowState = (navigation, apiService): MainFlowStateType => {
  const onSplashScreenDone = () => {
    navigation.navigate('MainFlow', { screen: 'GIFBrowserScreen' } );
  };

  return {
    onSplashScreenDone,
  };
};

export const MainFlow = () => {
  const navigation = useNavigation();
  const apiService = ApiService();
  const mainFlowState: MainFlowStateType = MainFlowState(navigation, apiService);

  return (
    <MainFlowContext.Provider value={mainFlowState}>
      <MainFlowNavigationStack.Navigator initialRouteName="SplashScreen">
        <MainFlowNavigationStack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <MainFlowNavigationStack.Screen
          name="GIFBrowserScreen"
          component={GIFBrowserScreen}
        />
      </MainFlowNavigationStack.Navigator>
    </MainFlowContext.Provider>
  );
};

