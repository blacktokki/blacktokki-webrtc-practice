import React, { useState, useRef, useEffect } from "react";
import {Button, View, Text} from "react-native";

import useAuthContext from "./useAuthContext";
import useWebsocketContext from "./useWebsocketContext";
import { RTCView, MediaStream, useLocalCam, camStyle} from "./webrtcCommon";


export default ()=>{
  const [stream, setStream] = useState<MediaStream>()
  const {user} = useAuthContext()
  const {lastJsonMessage, sendJsonMessage} = useWebsocketContext()
  const {start, stop, websocketOnMessage} = useLocalCam(sendJsonMessage, setStream)
  useEffect(()=>{
    lastJsonMessage && websocketOnMessage(lastJsonMessage, user)
  }, [lastJsonMessage])
  
  return (
    <View style={camStyle.container}>
      {stream && <RTCView stream={stream} style={camStyle.cam} />}
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

