import React, { useState } from 'react';
import { Text, StyleProp, ButtonProps, ViewStyle, TextStyle, Pressable} from 'react-native';

type CustomButtonProps = ButtonProps & {
    style?:StyleProp<ViewStyle>,
    textStyle?:StyleProp<TextStyle>
    onPress:()=>void
}

export default (props:CustomButtonProps)=>{
    const [hover, setHover] = useState(false)
    const _props = {
        color: '#f6f8fa',//'rgba(9,30,66,0.08)',//rgb(242,242,242)
        ...props,
    }
    return <Pressable
        onPress={()=>_props.onPress()}
        //@ts-ignore
        onHoverIn={()=>setHover(true)}
        onHoverOut={()=>setHover(false)}
        style={[
            {borderRadius:6, borderColor:'rgba(27,31,36,0.15)', borderWidth:1, backgroundColor:_props.color, paddingVertical:5, paddingHorizontal:16},
            _props.style, 
            hover?{backgroundColor:'rgb(242,242,242)'}:{}
        ]}>
            <Text selectable={false} style={[{color:'black', textAlign:'center', fontSize:14, fontWeight:'400'}, _props.textStyle]}>{_props.title}</Text>
        </Pressable>
}