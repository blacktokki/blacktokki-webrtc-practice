

import { useNavigation, useNavigationState } from '@react-navigation/core';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import drawer from '../screens/drawer';
import { ResponsiveNavigatorItemProps, ResponsiveNavigatorProps } from '../types';
export const tabBarHeight = 50

export const TabBarNavigation = ({data}:ResponsiveNavigatorProps)=>{
  const { colors } = useTheme();
  return <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: tabBarHeight,
          // paddingBottom,
          // paddingHorizontal: Math.max(insets.left, insets.right),
        },
        // tabBarStyle,
      ]}
      pointerEvents={false ? 'none' : 'auto'}
    >
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
    const state = useNavigationState(state=>state)
    const currentScreen = state?.routes[state.index|| 0].name;
    const data:ResponsiveNavigatorItemProps[] = Object.entries(drawer).map(([key, value])=>({
      label:value.screens.defaultStack.title,
      isFocused: currentScreen == key,
      navigate: () => navigation.navigate("Drawer", {screen:key})
    }))
    return ResponsiveNavigator?
      <View style={{}}><ResponsiveNavigator data={data}/></View>:
      <></>
}

const styles = StyleSheet.create({
    tabBar: {
      left: 0,
      right: 0,
      bottom: 0,
      borderTopWidth: StyleSheet.hairlineWidth,
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