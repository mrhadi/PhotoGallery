import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GIFBrowserScreen from './Screens/GIFBrowser.screen';
import SplashScreen from './Screens/Splash.screen';

import ApiService from './Services/api';
import { navigationRef } from './routing';

type GIFs = {
  url: string
  title: string
}

export type LocalDataType = {
  gifData: Array<GIFs>
}

export type MainFlowStateType = {
  onSplashScreenDone: Function
  getTrendingData: Function
  init: Function
  getGIFData: Function
}

const localData: LocalDataType = {
  gifData: [],
};

const MainFlowNavigationStack = createNativeStackNavigator();

export const MainFlowContext = React.createContext<MainFlowStateType | null>(
  null
);

const MainFlowState = (navigation, apiService): MainFlowStateType => {
  const init = () => {
    getTrendingData();
  };

  const onSplashScreenDone = () => {
    navigation.navigate('GIFBrowserScreen');
  };

  const filterData = (data: any): Array<GIFs> => data.map(item => ({
    url: item?.images?.fixedWidthStill?.url,
    title: item?.title,
  }));

  const getTrendingData = async () => {
    const res = await apiService.getTrending();
    const data = filterData(res?.data?.data);

    localData.gifData.push(data);
  };

  const getGIFData = () => localData.gifData;

  return {
    init,
    onSplashScreenDone,
    getTrendingData,
    getGIFData,
  };
};

export const MainFlow = () => {
  const navigation = navigationRef;
  const apiService = ApiService();
  const mainFlowState: MainFlowStateType = MainFlowState(navigation, apiService);

  console.log('MainFlow');

  mainFlowState.init();

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

