import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";

export default (props:{text:string, style:StyleProp<ViewStyle>})=><View style={[{borderRadius:5, borderWidth:1, borderStyle:'dashed'}, props.style]}>
    <Text>{props.text}</Text>
</View>