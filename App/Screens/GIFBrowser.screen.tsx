import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, Image, FlatList, TextInput, Button } from 'react-native';

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
  const searchInputRef = useRef<TextInput>(null);

  const onEndReached = async () => {
    await mainFlow.loadMoreData();
  };

  const onChangeText = (text: string) => {
    if (searchInputRef.current) {
      searchInputRef.current.value = text;
    }
  };

  const onSearch = async () => {
    const query = searchInputRef?.current?.value;
    if (query) {
      await mainFlow.onSearchGIF(query);
    }
  };

  return (
    <View style={{ flex: 1, paddingVertical: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
        <TextInput
          ref={searchInputRef}
          style={{ height: 40, margin: 12, borderWidth: 1, padding: 10, flexGrow: 1 }}
          placeholder="Search GIFs"
          onChangeText={onChangeText}
        />
        <Button
          title="Search"
          onPress={onSearch}
        />
      </View>
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
