/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { bottomTabPathConfig } from './BottomTabNavigator';

export default  {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      BottomTab: bottomTabPathConfig,
      NotFound: '*',
    },
  },
} as LinkingOptions;
