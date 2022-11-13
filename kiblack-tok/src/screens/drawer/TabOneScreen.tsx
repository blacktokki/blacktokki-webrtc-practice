import React, {useCallback, useRef} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, Text, Button, View} from 'react-native';


export default function TabOneScreen({
  navigation
}: StackScreenProps<any, 'TabOne'>) {
  return <View style={{padding:10}}>
    
  </View>
}

const styles = StyleSheet.create({
  Panel_Button_Text: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 21
  },
  Panel_Holder: {
    borderWidth: 1,
    borderColor: '#888',
    marginVertical: 5
  }
})