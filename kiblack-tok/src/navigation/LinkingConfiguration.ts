/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { drawerPathConfig } from './DrawerNavigator';

export default  {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Drawer: drawerPathConfig,
      NotFound: '*',
    },
  },
} as LinkingOptions;
