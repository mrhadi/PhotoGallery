import React, { useContext, useRef, useState } from 'react';
import { View, Text, Image, FlatList, TextInput, Button, Keyboard } from 'react-native';

import { MainFlowContext, MainFlowStateType, GIFItemType } from '../flow';
import { GIFBrowser } from '../constants';

const GIFItem = ({ title, url }: GIFItemType) => (
  <View style={{ paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }}>
    <Text numberOfLines={3} style={{ marginBottom: 4 }}>{title}</Text>
    <Image source={{ uri: url }} style={{ width: GIFBrowser.gifWidth, height: GIFBrowser.gifHeight, marginBottom: 5 }} />
  </View>
);

function GIFBrowserScreen() {
  const mainFlow: MainFlowStateType = useContext(MainFlowContext);
  const [searchMode, setSearchMode] = useState(false);
  const [keyword, setKeyword] = useState('');

  const gifData = mainFlow.getGIFData();
  const searchInputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);

  const onEndReached = async () => {
    await mainFlow.loadMoreData();
  };

  const onChangeText = (text: string) => {
    setKeyword(text);
  };

  const onSearch = async () => {
    Keyboard.dismiss();
    flatListRef?.current?.scrollToOffset({ offset: 0, animated: true });

    await mainFlow.onSearchGIF(keyword);
    setSearchMode(!searchMode);
  };

  const onReset = async () => {
    flatListRef?.current?.scrollToOffset({ offset: 0, animated: true });

    await mainFlow.onResetSearch();
    setKeyword('');
  };

  return (
    <View style={{ flex: 1, paddingVertical: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
        <TextInput
          ref={searchInputRef}
          style={{ height: 40, margin: 12, borderWidth: 1, padding: 10, flexGrow: 1 }}
          placeholder="Search GIFs"
          onChangeText={onChangeText}
          value={keyword}
        />
        <Button
          title="Search"
          onPress={onSearch}
        />
        <Button
          title="Reset"
          onPress={onReset}
        />
      </View>
      <FlatList
        ref={flatListRef}
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
