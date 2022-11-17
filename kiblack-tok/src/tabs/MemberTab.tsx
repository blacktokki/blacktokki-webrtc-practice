import { MaterialIcons } from "@expo/vector-icons"
import React from "react"
import { Text, View } from "react-native"
import CommonItem from "../components/CommonItem"

export default ()=><View style={{flex:1, backgroundColor:'white'}}>
    <CommonItem bodyStyle={{flexDirection:'row', justifyContent:'flex-start'}}>
        <MaterialIcons size={38} style={{ marginBottom: -3, marginRight:10 }} name='account-circle'/>
        <Text style={{fontSize:20, fontWeight:'400'}}>Lorem Ipsum</Text>
    </CommonItem>
    <CommonItem/>
</View>