import React, {useCallback, useRef} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '../types';
import { StyleSheet, Text, Button} from 'react-native';


export default function TabOneScreen({
  navigation
}: StackScreenProps<typeof DrawerParamList, 'TabOne'>) {
  return <></>
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