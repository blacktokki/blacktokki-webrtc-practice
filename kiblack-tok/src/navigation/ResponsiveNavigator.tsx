

import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useNavigationState } from '@react-navigation/core';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DummyView from '../components/DummyView';
import bottomTab from '../screens/bottom-tab';
import { ResponsiveNavigatorItemProps, ResponsiveNavigatorProps } from '../types';
export const tabBarWidth = 240

export const DrawerNavigator = ({data}:ResponsiveNavigatorProps)=>{
  const { colors } = useTheme();
  return <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          // paddingBottom,
          // paddingHorizontal: Math.max(insets.left, insets.right),
        },
        // tabBarStyle,
      ]}
      pointerEvents={false ? 'none' : 'auto'}
    >
      <DummyView style={{width:'100%', height:135}} text='profile'/>
      <View accessibilityRole="tablist" style={styles.content}>
        {data.map((d, index)=>{
          return (
          <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={d.isFocused ? { selected: true } : {}}
              onPress={d.navigate}
              style={styles.tab}
          >
              <FontAwesome size={30} style={{ marginBottom: -3 }} name='code'/>
              <Text style={[styles.label, { color: d.isFocused ? colors.primary : '#222' }]}>
              {d.label}
              </Text>
          </TouchableOpacity>
          );
      })}
      </View>
    </View>
}

type ResponsiveNavigatorContainerProps = {
  ResponsiveNavigator?:(props:ResponsiveNavigatorProps)=>JSX.Element
}

export default ({ ResponsiveNavigator}:ResponsiveNavigatorContainerProps)=> {
    const navigation = useNavigation()
    const state = useNavigationState(state=>state.routes[0].state)
    const currentScreen = state?.routes[state.index|| 0].name;
    const data:ResponsiveNavigatorItemProps[] = Object.entries(bottomTab).map(([key, value])=>({
      label:value.title,
      isFocused: currentScreen == key,
      navigate: () => navigation.navigate(key)
    }))
    return ResponsiveNavigator?
      <ResponsiveNavigator data={data}/>:
      <></>
}

const styles = StyleSheet.create({
    tabBar: {
      width:240,
      elevation: 8,
    },
    content: {
      flex: 1,
      flexDirection: 'row',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
    },
    label: {
        textAlign: 'center',
        backgroundColor: 'transparent',
      },
  });