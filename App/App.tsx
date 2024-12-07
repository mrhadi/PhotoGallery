import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';

import ApiService from './Services/api';
const apiService = ApiService();

const App = () => {
  useEffect(() => {
    apiService.getTrending().then(res => console.log(res))
  });

  return (
    <SafeAreaView>
    </SafeAreaView>
  );
}

export default App;
