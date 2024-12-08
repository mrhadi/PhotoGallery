import React, { useContext, useEffect } from 'react';
import { View, Text, Image, FlatList } from 'react-native';

import { MainFlowContext, MainFlowStateType } from '../flow';
import { GIFBrowser } from '../constants';

type GIFItemProps = {
  title: string
  url: string
};

const GIFItem = ({ title, url }: GIFItemProps) => (
  <View style={{ paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }}>
    <Text numberOfLines={3} style={{ marginBottom: 4 }}>{title}</Text>
    <Image source={{ uri: url }} style={{ width: GIFBrowser.gifWidth, height: GIFBrowser.gifHeight, marginBottom: 5 }} />
  </View>
);

function GIFBrowserScreen() {
  const mainFlow: MainFlowStateType = useContext(MainFlowContext);
  const gifData = mainFlow.getGIFData();

  const onEndReached = async () => {
    await mainFlow.loadMoreData();
  };

  return (
    <View style={{ flex: 1, paddingVertical: 10 }}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={gifData}
        renderItem={({ item }) => <GIFItem url={item.url} title={item.title} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={1}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
}

export default GIFBrowserScreen;
