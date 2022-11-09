import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import _ from 'lodash';
import { initRender, Navigation, useColorScheme, pushScreenModule } from './src';
import useCachedResources from './useCachedResources';

import {_default} from './src/screens';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    pushScreenModule(_default)
    initRender(['default'])
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
