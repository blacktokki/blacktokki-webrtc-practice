import React, { useState, useEffect, } from "react";
import {Button,Text, TextInput, View} from "react-native";
import useWebsocketContext from "./useWebsocketContext";
import { useRemoteCam, camStyle} from "./webrtc";

export default ()=>{
  const [username, setUsername] = useState('')
  const {lastJsonMessage, sendJsonMessage} = useWebsocketContext()
  const {start, stop, websocketOnMessage, renderRTCView, isPlay} = useRemoteCam(sendJsonMessage)
  useEffect(()=>{
    lastJsonMessage && websocketOnMessage(lastJsonMessage)
  }, [lastJsonMessage])

  return (
    <View style={camStyle.container}>
      {renderRTCView(camStyle.cam)}
      <View style={camStyle.bottonContainer}>
        <View style={camStyle.buttonBar}>
          {isPlay?
            <Text style={{borderWidth:1, flex:1}}>Username:{username}</Text>:
            <>
              <Text style={{borderWidth:1}}>Username:&nbsp;</Text>
              <TextInput style={{borderWidth:1, flex:1}} value={username} onChangeText={setUsername}/>
            </>
          }
        </View>
        <View style={camStyle.buttonBar}>
          <Button title="Start" onPress={()=>start(username)} />
          <Button title="Stop" onPress={stop} />
        </View>
      </View>
    </View>
  );
}

