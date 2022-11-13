import * as React from 'react';
import { DrawerContentComponentProps, DrawerContentOptions, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { View } from 'react-native';
import DummyView from '../components/DummyView';
export const NavigatorSections:Record<string, string[]> = {}

export default (props:DrawerContentComponentProps<DrawerContentOptions>) => {
    return<DrawerContentScrollView>
      <DummyView style={{width:'100%', height:135}} text='profile'/>
      <View style={{flexDirection:'row'}}><DrawerItemList {...props} itemStyle={{maxWidth:80, marginHorizontal:1}}/></View>  
    </DrawerContentScrollView>
  };