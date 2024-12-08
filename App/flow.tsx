import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GIFBrowserScreen from './Screens/GIFBrowser.screen';
import SplashScreen from './Screens/Splash.screen';

import ApiService from './Services/api';
import { navigationRef } from './routing';
import { GIFBrowser } from './constants';
import { logConsole } from './Services/LogTracker';

export type GIFItemType = {
  title: string
  url: string
};

export type PaginationType = {
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
  onResetSearch: Function
}

export type LocalDataType = {
  gifData: Array<GIFItemType>
  gifLoadingOffset: number
  maxAvailableDataCount: number | null
  isSearching: boolean
  searchQuery: string
}

const localData: LocalDataType = {
  gifData: [],
  gifLoadingOffset: 0,
  maxAvailableDataCount: null,
  isSearching: false,
  searchQuery: '',
};

const MainFlowNavigationStack = createNativeStackNavigator();

export const MainFlowContext = React.createContext<MainFlowStateType | null>(
  null
);

const MainFlowState = (navigation, apiService): MainFlowStateType => {
  const resetLocalData = () => {
    localData.gifData.length = 0;
    localData.gifLoadingOffset = 0;
    localData.maxAvailableDataCount = null;
    localData.isSearching = false;
    localData.searchQuery = '';
  };

  const init = () => {
    resetLocalData();
    getTrendingData();
  };

  const onSplashScreenDone = () => {
    navigation.navigate('GIFBrowserScreen');
  };

  const filterData = (data: any): Array<GIFItemType> => data.map(item => ({
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

    if (localData.isSearching) {
      await searchGIFs(localData.gifLoadingOffset, localData.searchQuery);
    } else {
      await getTrendingData(localData.gifLoadingOffset);
    }
  };

  const onSearchGIF = async (query: string) => {
    logConsole('Searching for ' + query);

    resetLocalData();

    if (query === '') {
      localData.isSearching = false;
      localData.searchQuery = '';

      await getTrendingData();
    } else {
      localData.isSearching = true;
      localData.searchQuery = query;

      await searchGIFs(localData.gifLoadingOffset, query);
    }
  };

  const onResetSearch = async () => {
    resetLocalData();

    localData.isSearching = false;
    localData.searchQuery = '';

    await getTrendingData();
  };

  const getGIFData = () => (localData.gifData);

  return {
    init,
    onSplashScreenDone,
    getTrendingData,
    getGIFData,
    loadMoreData,
    onSearchGIF,
    onResetSearch,
  };
};

export const MainFlow = () => {
  const navigation = navigationRef;
  const apiService = ApiService();
  const mainFlowState: MainFlowStateType = MainFlowState(navigation, apiService);

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

