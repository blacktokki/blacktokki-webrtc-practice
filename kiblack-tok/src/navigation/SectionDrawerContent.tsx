import * as React from 'react';
import { DrawerContentComponentProps, DrawerContentOptions, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { View } from 'react-native';
import DummyView from '../components/DummyView';
export const NavigatorSections:Record<string, string[]> = {}

export default (props:DrawerContentComponentProps<DrawerContentOptions>) => {
    const originState = props.state;
    let index = originState.index;
    return<DrawerContentScrollView>
      <DummyView style={{width:'100%', height:135}} text='profile'/>
      {Object.keys(NavigatorSections).map((key)=>{
        const routes = originState.routes.filter((value)=>NavigatorSections[key].find((v)=>(v==value.name)))
        const state = Object.assign(Object.assign({}, originState), {routes, index});
        index -= routes.length
        return <View key={key} style={{flexDirection:'row'}}><DrawerItemList key={key} {...props} state={state} itemStyle={{maxWidth:80, marginHorizontal:1}}/></View>
      })}
        
    </DrawerContentScrollView>
  };