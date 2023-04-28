import React, { useEffect } from "react";
import {Button, View, Text} from "react-native";
import useAuthContext from "./useAuthContext";
import useWebsocketContext from "./useWebsocketContext";
import { useLocalCam, camStyle} from "./webrtc";


export default ()=>{
  const {user} = useAuthContext()
  const {lastJsonMessage, sendJsonMessage} = useWebsocketContext()
  const {start, stop, websocketOnMessage, renderRTCView} = useLocalCam(sendJsonMessage)
  useEffect(()=>{
    lastJsonMessage && websocketOnMessage(lastJsonMessage, user)
  }, [lastJsonMessage])
  
  return (
    <View style={camStyle.container}>
      {renderRTCView(camStyle.cam)}
      <View style={camStyle.bottonContainer}>
        <View style={camStyle.buttonBar}>
          <Text style={{flex:1}}>Username: {user?.username}</Text>
        </View>
        <View style={camStyle.buttonBar}>
          <Button title="Start" onPress={()=>start(user)} />
          <Button title="Stop" onPress={stop} />
        </View>
      </View>
    </View>
  );
}

