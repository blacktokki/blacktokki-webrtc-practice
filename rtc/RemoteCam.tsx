import axios from "axios";
import React, { useState, useRef, useEffect, } from "react";
import {Button,Text, TextInput, View} from "react-native";
import { RTCView, RTCPeerConnection, MediaStream, RTCSessionDescription } from "react-native-webrtc-web-shim";
import useWebsocketContext from "./useWebsocketContext";
import { camStyle, onICEcandidate, peerConstraints, sendICEcandidate, sessionConstraints } from "./webrtcCommon";

const websocketOnMessage = async(response, pcRef, sendMessage, setStream)=>{
  let type = response.type;
  if (type == "call" && pcRef.current.user.username == response.data.username){
    console.log('2 call')
    const peerConnection = pcRef.current.pc
    pcRef.current.user.id = response.sender
    if (!peerConnection)
      return
    peerConnection.addEventListener( 'icecandidate', event => sendICEcandidate(event, sendMessage, response.sender, 'local'));
    const offerDescription = new RTCSessionDescription(response.data.rtcMessage);
    await peerConnection.setRemoteDescription( offerDescription );
    const answerDescription = await peerConnection.createAnswer( sessionConstraints );
    await peerConnection.setLocalDescription( answerDescription );
    sendMessage({type:'answer', user:pcRef.current.user?.id, data:{rtcMessage:peerConnection.localDescription}})
    // Here is a good place to process candidates.
    const streams = pcRef.current.pc.getRemoteStreams()
    setStream(streams[streams.length - 1])
  }
  if (type == "ICEcandidate" && response.data.target=='remote' && pcRef.current.user.id == response.sender)
    onICEcandidate(pcRef.current.pc, response)
}

export default ()=>{
  const pcRef = useRef<{pc?:RTCPeerConnection, user?:{username:string, id?:number}}>({})
  const [username, setUsername] = useState('')
  const [stream, setStream] = useState<MediaStream>()
  const {lastJsonMessage, sendJsonMessage} = useWebsocketContext()
  useEffect(()=>{
    lastJsonMessage && websocketOnMessage(lastJsonMessage, pcRef, sendJsonMessage, setStream)
  }, [lastJsonMessage])
  const start = ()=>{
    console.log("start");
    if (!pcRef.current.pc) {
      pcRef.current.pc = new RTCPeerConnection( peerConstraints );
      pcRef.current.user = {username}
    }
    if (!stream){
      sendJsonMessage({type:'start', username, data:{}})
    }
  }

  const stop = () => {
    console.log("stop");
    if (pcRef.current.pc) {
      // peerConnection._unregisterEvents();
      setStream(undefined)
      pcRef.current.pc.close();
      pcRef.current.pc = undefined
      pcRef.current.user = undefined
    }
  };

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
          <Button title="Start" onPress={start} />
          <Button title="Stop" onPress={stop} />
        </View>
      </View>
    </View>
  );
}

