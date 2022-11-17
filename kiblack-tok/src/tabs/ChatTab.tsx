import { FontAwesome } from "@expo/vector-icons"
import React from "react"
import { Text, View } from "react-native"
import CommonItem from "../components/CommonItem"
import { navigate } from "../navigation"

export default ()=><View style={{flex:1, backgroundColor:'white'}}>
    <CommonItem bodyStyle={{flexDirection:'row', justifyContent:'space-between'}} onPress={()=>navigate("ChatScreen", {})}>
        <View style={{flexDirection:'row'}}>
            <FontAwesome size={36} style={{ marginBottom: -3, marginRight:20 }} name='users'/>
            <View>
                <View style={{flexDirection:'row'}}>
                    <Text style={{fontSize:18}}>Lorem Ipsum</Text>
                    <Text style={{fontSize:18, opacity: 0.4, paddingLeft:5}}>3</Text>
                </View>
                <Text style={{fontSize:16, opacity: 0.4}}>Hello world!</Text>
            </View>
        </View>
        <View>
            <Text style={{fontSize:14, opacity: 0.4}}>12:00</Text>
            <Text style={{fontSize:14}}>10</Text>
        </View>
    </CommonItem>
    <CommonItem/>
</View>