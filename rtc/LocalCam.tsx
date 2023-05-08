import React, { useEffect } from "react";
import {Button, View, Text} from "react-native";
import useAuthContext from "./useAuthContext";

import useWebsocketContext from "./useWebsocketContext";
import { useLocalCam, camStyle} from "./webrtc";


export default (props:{mode?:'camera'|'display'|null})=>{
  const auth = useAuthContext()
  const {lastJsonMessage, sendJsonMessage} = useWebsocketContext()
  const {start, stop, websocketOnMessage, CustomRTCView, isPlay, sender} = useLocalCam(sendJsonMessage)
  useEffect(()=>{
    auth.user && lastJsonMessage && websocketOnMessage(lastJsonMessage, auth.user)
  }, [lastJsonMessage, auth])
  useEffect(()=>{
    if(props.mode){
      auth.user && start(auth.user, undefined, props.mode)
    }
    else if(props.mode===null){
      isPlay && stop()
    }
  }, [auth, props.mode])
  return (
    <View style={camStyle.container}>
      <CustomRTCView style={camStyle.cam}/>
      <View style={camStyle.bottonContainer}>
        <View style={camStyle.buttonBar}>  
        </View>
        {(props.mode === undefined || isPlay) &&<View style={{flexDirection:'row'}}><Text style={camStyle.label}>{auth.user?.name} : {sender}</Text></View>}
        <View style={camStyle.buttonBar}>
          {props.mode === undefined && !isPlay && <Button title="Start" onPress={()=>auth.user && start(auth.user)} />}
          {props.mode === undefined && isPlay && <Button title="Stop" onPress={stop} />}
        </View>
      </View>
    </View>
  );
}
