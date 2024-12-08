import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GIFBrowserScreen from './Screens/GIFBrowser.screen';
import SplashScreen from './Screens/Splash.screen';

import ApiService from './Services/api';
import { navigationRef } from './routing';
import { GIFBrowser } from './constants';
import { logConsole } from './Services/LogTracker';

type GIFs = {
  url: string
  title: string
}

type PaginationType = {
  count: number
  offset: number
  totalCount: number
}

export type MainFlowStateType = {
  onSplashScreenDone: Function
  getTrendingData: Function
  init: Function
  getGIFData: Function
  loadMoreData: Function
  onSearchGIF: Function
}

export type LocalDataType = {
  gifData: Array<GIFs>
  gifLoadingOffset: number
  maxAvailableDataCount: number | null
}

const localData: LocalDataType = {
  gifData: [],
  gifLoadingOffset: 0,
  maxAvailableDataCount: null,
};

const MainFlowNavigationStack = createNativeStackNavigator();

export const MainFlowContext = React.createContext<MainFlowStateType | null>(
  null
);

const MainFlowState = (navigation, apiService): MainFlowStateType => {
  const resetLocalData = () => {
    localData.gifData = [];
    localData.gifLoadingOffset = 0;
    localData.maxAvailableDataCount = null;
  };

  const init = () => {
    resetLocalData();
    getTrendingData();
  };

  const onSplashScreenDone = () => {
    navigation.navigate('GIFBrowserScreen');
  };

  const filterData = (data: any): Array<GIFs> => data.map(item => ({
    url: item?.images?.fixedWidthStill?.url,
    title: item?.title,
  }));

  const isMoreDataAvailable = () => localData.gifLoadingOffset + GIFBrowser.maxGIFPerLoad <= localData.maxAvailableDataCount;

  const getTrendingData = async (offset: number = 0) => {
    const res = await apiService.getTrending(offset, GIFBrowser.maxGIFPerLoad);
    const paginationData: PaginationType = res?.data?.pagination;
    const data = filterData(res?.data?.data);

    localData.maxAvailableDataCount = paginationData.totalCount;
    logConsole('maxAvailableDataCount: ' + paginationData.totalCount);

    localData.gifData.push(...data);
  };

  const searchGIFs = async (offset: number = 0, query: string) => {
    const res = await apiService.searchGIFs(query, offset, GIFBrowser.maxGIFPerLoad);
    const paginationData: PaginationType = res?.data?.pagination;
    const data = filterData(res?.data?.data);

    localData.maxAvailableDataCount = paginationData.totalCount;
    logConsole('maxAvailableDataCount: ' + paginationData.totalCount);

    localData.gifData.push(...data);
  };

  const loadMoreData = async () => {
    if (!isMoreDataAvailable()) {
      logConsole('No more data available to load!');
      return;
    }

    localData.gifLoadingOffset = localData.gifLoadingOffset + GIFBrowser.maxGIFPerLoad;
    logConsole('loadMoreData:offset: ' + localData.gifLoadingOffset);

    await getTrendingData(localData.gifLoadingOffset);
  };

  const onSearchGIF = async (query: string) => {
    logConsole('Searching for ' + query);

    resetLocalData();

    await searchGIFs(localData.gifLoadingOffset, query);
  };

  const getGIFData = () => localData.gifData;

  return {
    init,
    onSplashScreenDone,
    getTrendingData,
    getGIFData,
    loadMoreData,
    onSearchGIF,
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
          options={{ headerShown: false }}
        />
      </MainFlowNavigationStack.Navigator>
    </MainFlowContext.Provider>
  );
};

