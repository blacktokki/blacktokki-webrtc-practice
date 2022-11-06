import React, { useState, useRef } from "react";
import {Button,Text, TextInput, View} from "react-native";
import { RTCView, RTCPeerConnection, MediaStream, RTCSessionDescription } from "react-native-webrtc-web-shim";
import useWebsocket from "./useWebsocket";
import { camStyle, onICEcandidate, peerConstraints, sendICEcandidate, sessionConstraints } from "./webrtcCommon";

export default ()=>{
  const pcRef = useRef<{pc?:RTCPeerConnection, name?:string}>({})
  const [name, setName] = useState('')
  const [stream, setStream] = useState<MediaStream>()

  const websocketRef = useWebsocket(async(response)=>{
    let type = response.type;
    if (type == "call_received" && pcRef.current.name == response.data.caller){
      console.log('2 call_received')
      const peerConnection = pcRef.current.pc
      if (!peerConnection)
        return
      peerConnection.addEventListener( 'icecandidate', event => sendICEcandidate(event, websocketRef.current, response.data.caller));
      const offerDescription = new RTCSessionDescription(response.data.rtcMessage);
      await peerConnection.setRemoteDescription( offerDescription );
      const answerDescription = await peerConnection.createAnswer( sessionConstraints );
      await peerConnection.setLocalDescription( answerDescription );
      websocketRef.current.send(JSON.stringify({type:'answer_call', data:{caller:response.data.caller, rtcMessage:peerConnection.localDescription}}))
      // Here is a good place to process candidates.
      const streams = pcRef.current.pc.getRemoteStreams()
      setStream(streams[streams.length - 1])
    }
    if (type == "ICEcandidate")
      onICEcandidate(pcRef.current.pc,pcRef.current.name, response.data, true)
  })
  const start = ()=>{
    console.log("start");
    if (!pcRef.current.pc) {
      pcRef.current.pc = new RTCPeerConnection( peerConstraints );
    }
    if (!stream){
      pcRef.current.name = name
      websocketRef.current.send(JSON.stringify({type:'ready_call', data:{user:name}}))
    }
  }

  const stop = () => {
    console.log("stop");
    if (pcRef.current.pc) {
      // peerConnection._unregisterEvents();
      setStream(undefined)
      pcRef.current.pc.close();
      pcRef.current.pc = undefined
    }
  };

  return (
    <View style={camStyle.container}>
      {stream && <RTCView stream={stream} style={camStyle.cam} />}
      <View style={camStyle.bottonContainer}>
        <View style={camStyle.buttonBar}>
          {stream?
            <Text style={{borderWidth:1, flex:1}}>{name}</Text>:
            <TextInput style={{borderWidth:1, flex:1}} value={name} onChangeText={setName}/>
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

