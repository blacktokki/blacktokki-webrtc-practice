

import { useNavigation, useNavigationState } from '@react-navigation/core';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, useWindowDimensions } from 'react-native';
import useResizeWindow from '../hooks/useResizeWindow';
import { ResponsiveNavigatorItemProps, ResponsiveNavigatorProps } from '../types';
import { NavigatorSections } from './SectionDrawerContent'
export const NavigatorsTitle:Record<string, string> = {}
const tabBarHeight = 50

export const TabBarNavigation = ({data, children}:ResponsiveNavigatorProps)=>{
  const { colors } = useTheme();
  const childrenMemo = useMemo(()=>children, [])
  return <>
    {childrenMemo}
    <View
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
  </>
}

type ResponsiveNavigatorContainerProps = {
  keys:string[],
  ResponsiveNavigator?:(props:ResponsiveNavigatorProps)=>JSX.Element
  children:React.ReactNode
}

export default ({ keys, children, ResponsiveNavigator }:ResponsiveNavigatorContainerProps)=> {
    const window = useWindowDimensions()
    const windowType = useMemo(()=>window.height >= window.width?'portrait':'landscape', [window])
    const navigation = useNavigation()
    const state = useNavigationState(state=>state.routes[0].state)
    const currentScreen = state?.routes[state.index|| 0].name;
    const data = ([] as ResponsiveNavigatorItemProps[]).concat(...keys.map(screenKey=>NavigatorSections[screenKey].map(screen=>({
      label:NavigatorsTitle[screen],
      isFocused: currentScreen == screen,
      navigate: () => navigation.navigate("Root", {screen})
    }))))
    return windowType== "portrait" && ResponsiveNavigator?<ResponsiveNavigator data={data}>
      {children}
    </ResponsiveNavigator>:<>{children}</>
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