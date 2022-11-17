import React, {useCallback, useRef} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, Text, Button, View} from 'react-native';
import CommonSection from '../../components/CommonSection';
import CommonItem from '../../components/CommonItem';
import {TabViewNavigator} from '../../navigation/DrawerNavigator';
import useResizeWindow from '../../hooks/useResizeWindow';
import { bottomTabs } from '../../tabs';


export default function HomeScreen({navigation, route}: StackScreenProps<any, 'Home'>) {
  const windowType = useResizeWindow();
  return windowType == 'landscape'?
    <View style={{padding:10}}></View>:
    <TabViewNavigator tabs={bottomTabs} tabBarPosition="bottom" index={parseInt(route.params?.['tab'] || 0)} onTab={(index)=>{navigation.setParams({tab:index})}}/>
}

