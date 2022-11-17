import React, {useCallback, useRef} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, Text, Button, View} from 'react-native';
import CommonSection from '../../components/CommonSection';
import { MaterialIcons } from '@expo/vector-icons';


export default function BoardScreen({navigation}: StackScreenProps<any, 'TabChat'>) {
  return <View style={{padding:10, alignItems:'center'}}>
    <View style={{flexDirection:'row', justifyContent:'flex-start', width:'100%'}}>
      <MaterialIcons size={38} style={{marginBottom: -3, marginRight:10 }} name='account-circle'/>
      <CommonSection outerContainerStyle={{width:undefined}} title={'lorem ipsum'} titleStyle={{flex:undefined}} />
    </View>
    <View style={{flexDirection:'row', justifyContent:'flex-start', width:'100%'}}>
      <View style={{width:48}}/>
      <CommonSection outerContainerStyle={{width:undefined}} titleStyle={{flex:undefined}} />
    </View>
    <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%'}}>
      <View style={{width:48}}/>
      <CommonSection outerContainerStyle={{width:undefined}} title={'lorem ipsum'} titleStyle={{flex:undefined}} />
    </View>
    <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%'}}>
      <View style={{width:48}}/>
      <CommonSection outerContainerStyle={{width:undefined}} titleStyle={{flex:undefined}} />
    </View>
  </View>
}
// outerContainerStyle={{alignContent:'flex-end'}} containerStyle={{width:'50%'}}
