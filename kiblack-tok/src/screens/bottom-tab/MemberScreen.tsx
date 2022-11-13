import React, {useCallback, useRef} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, Text, Button, View} from 'react-native';
import CommonSection from '../../components/CommonSection';
import CommonItem from '../../components/CommonItem';


export default function MemberScreen({navigation}: StackScreenProps<any, 'Member'>) {
  return <View style={{padding:10}}>
    <CommonSection>
      <CommonItem/>
      <CommonItem/>
      <CommonItem/>
    </CommonSection>
  </View>
}

