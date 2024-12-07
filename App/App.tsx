import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, Image } from 'react-native';

import ApiService from './Services/api';
const apiService = ApiService();

type GIFs = {
  bitlyGifUrl: string
  title: string
}

type GIFItemProps = {
  title: string
  url: string
};

const GIFItem = ({ title, url }: GIFItemProps) => (
  <Image source={{ uri: url }} style={{ width: 320, height: 200, backgroundColor: 'red', marginBottom: 5 }} />
);

const App = () => {
  const [trendingData, setTrendingData] = useState<[GIFs]>([]);

  useEffect(() => {
    apiService.getTrending().then(res => {
      const data = res?.data?.data;
      console.log(JSON.stringify(data[0].images.fixedWidthStill));

      const filteredData: [GIFs] = data.map(item => ({
        bitlyGifUrl: item.images.fixedWidthStill.url,
        title: item.title,
      }));

      setTrendingData(filteredData);
    });
  }, []);

  return (
    <SafeAreaView>
      <FlatList
        data={trendingData}
        renderItem={({ item}) => <GIFItem url={item.bitlyGifUrl} title={item.title} /> }
      />
    </SafeAreaView>
  );
};

export default App;
