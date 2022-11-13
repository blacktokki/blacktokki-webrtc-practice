import * as React from 'react';
import { View, Text } from './Themed';
import { StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

export type ItemParamList = {
    outerContainerStyle?:StyleProp<TextStyle>
    containerStyle?:StyleProp<ViewStyle>
    bodyStyle?:StyleProp<ViewStyle>
    children?: React.ReactNode
    onPress?: ()=>void
}

export default function CommonItem(props:ItemParamList){
  return (
    <View style={[styles.outerContainer, props.outerContainerStyle]}>
        <View style={[styles.container, props.containerStyle]}>
            <View style={[styles.bodyView, props.bodyStyle]}>
              {props.children}
            </View>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
  outerContainer:{
    width:'100%',
    maxWidth:1080,
    alignItems:'stretch',
    backgroundColor:'rgba(0,0,0,0)'
  },  
  container: {
      marginHorizontal:20,
      backgroundColor:'rgba(0,0,0,0)',
    },
    bodyView:{
      width: '100%',
      padding: 10,
      minHeight: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth:1,
      borderColor:'#d0d7de',
    }
  });
  