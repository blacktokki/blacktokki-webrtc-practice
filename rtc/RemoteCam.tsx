import React, { useState, useEffect, } from "react";
import {Button,Text, TextInput, View} from "react-native";
import useWebsocketContext from "./useWebsocketContext";
import { useRemoteCam, camStyle} from "./webrtc";

export default (props:{receiver?:string})=>{
  const [receiver, setReceiver] = useState('')
  const {lastJsonMessage, sendJsonMessage} = useWebsocketContext()
  const {start, stop, websocketOnMessage, CustomRTCView, isPlay, user} = useRemoteCam(sendJsonMessage)
  useEffect(()=>{
    lastJsonMessage && websocketOnMessage(lastJsonMessage)
  }, [lastJsonMessage])
  useEffect(()=>{
    if(props.receiver){
      start(props.receiver)
    }
    return ()=>stop()
  }, [props.receiver])
  return (
    <View style={camStyle.container}>
      <CustomRTCView style={camStyle.cam}/>
      <View style={camStyle.bottonContainer}>
        <View style={camStyle.buttonBar}>
        </View>
        {(props.receiver ===undefined || isPlay) &&
          <View style={{flexDirection:'row'}}>{
            (props.receiver || isPlay)?
            <Text style={camStyle.label}>{user?.name} : {props.receiver || receiver}</Text>:
            <>
              <Text style={{borderWidth:1}}>Receiver:&nbsp;</Text>
              <TextInput style={{borderWidth:1, flex:1}} value={receiver} onChangeText={setReceiver}/>
            </> 
          }</View>}
        <View style={camStyle.buttonBar}>
          {props.receiver === undefined && !isPlay && <Button title="Start" onPress={()=>start(receiver)} />}
          {props.receiver === undefined && isPlay && <Button title="Stop" onPress={stop} />}
        </View>
      </View>
    </View>
  );
}

