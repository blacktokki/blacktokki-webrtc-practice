import React from "react"
import { View } from "react-native"
import CommonItem from "../components/CommonItem"

const DrawerTab = (props:{data:any[]})=><View style={{flex:1, backgroundColor:'white'}}>
    <CommonItem/>
    <CommonItem/>
</View>

export default {
    Member:()=><DrawerTab data={[]}/>,
    Chat:()=><DrawerTab data={[]}/>,
    Channel:()=><DrawerTab data={[]}/>,
}