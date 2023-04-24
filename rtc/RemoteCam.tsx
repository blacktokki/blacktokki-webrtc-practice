import axios from "axios";
import React, { useState, useRef, useEffect, } from "react";
import {Button,Text, TextInput, View} from "react-native";
import useWebsocketContext from "./useWebsocketContext";
import { RTCView, MediaStream, useRemoteCam, camStyle} from "./webrtcCommon";

export default ()=>{
  const [username, setUsername] = useState('')
  const [stream, setStream] = useState<MediaStream>()
  const {lastJsonMessage, sendJsonMessage} = useWebsocketContext()
  const {start, stop, websocketOnMessage} = useRemoteCam(sendJsonMessage, setStream)
  useEffect(()=>{
    lastJsonMessage && websocketOnMessage(lastJsonMessage)
  }, [lastJsonMessage])
  const _start = ()=>{
    if (!stream)
      start(username)
  }

  return (
    <View style={camStyle.container}>
      {stream && <RTCView stream={stream} style={camStyle.cam} />}
      <View style={camStyle.bottonContainer}>
        <View style={camStyle.buttonBar}>
          {stream?
            <Text style={{borderWidth:1, flex:1}}>Username:{username}</Text>:
            <>
              <Text style={{borderWidth:1}}>Username:&nbsp;</Text>
              <TextInput style={{borderWidth:1, flex:1}} value={username} onChangeText={setUsername}/>
            </>
          }
        </View>
        <View style={camStyle.buttonBar}>
          <Button title="Start" onPress={_start} />
          <Button title="Stop" onPress={stop} />
        </View>
      </View>
    </View>
  );
}

