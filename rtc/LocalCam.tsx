import React, { useState, useRef } from "react";
import {Button, View} from "react-native";
import { RTCView, mediaDevices, RTCPeerConnection, MediaStream, RTCSessionDescription } from "react-native-webrtc-web-shim";
import useWebsocket from "./useWebsocket";
import { camStyle, onICEcandidate, peerConstraints, sendICEcandidate, sessionConstraints } from "./webrtcCommon";

const createOffer = async(pcRefCurrent:{pc?:typeof RTCPeerConnection, stream?:typeof MediaStream, name?:string}, websocketRef:{current:WebSocket})=>{
  pcRefCurrent.stream && pcRefCurrent.pc.addStream( pcRefCurrent.stream );
  const offerDescription = await pcRefCurrent.pc.createOffer( sessionConstraints );
  await pcRefCurrent.pc.setLocalDescription( offerDescription );
  console.log(websocketRef.current)
  websocketRef.current.send(JSON.stringify({type:'call', data:{name:pcRefCurrent.name, rtcMessage:offerDescription}}))
}

export default ()=>{
  const pcRef = useRef<{pc?:typeof RTCPeerConnection, stream?:typeof MediaStream, name?:string}>({})
  const [stream, setStream] =useState<MediaStream>()
  const websocketRef = useWebsocket(async(response)=>{
    let type = response.type;
    if (type == 'call_ready'){
      console.log('1 call_ready')
      const peerConnection = new RTCPeerConnection( peerConstraints );
      peerConnection.addEventListener( 'icecandidate', event => sendICEcandidate(event, websocketRef.current, response.data.sender));
      pcRef.current.pc = peerConnection
      pcRef.current.name = response.data.sender
      createOffer(pcRef.current, websocketRef)
    }
    
    if (type == "call_answered"){
      console.log('3 call_answered')
      const answerDescription = new RTCSessionDescription(response.data.rtcMessage);
      await pcRef.current.pc.setRemoteDescription( answerDescription );
    }
    if (type == "ICEcandidate")
      onICEcandidate(pcRef.current.pc, pcRef.current.name, response.data, false)
  })
  const start = async () => {
    console.log("start");
    if (!pcRef.current.stream) {
      try {
        pcRef.current.stream = await mediaDevices.getUserMedia({audio:true, video:true});
        setStream(pcRef.current.stream)
        if (pcRef.current.pc)
          createOffer(pcRef.current, websocketRef)
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stop = async ()=>{
    console.log("stop");
    if(pcRef.current.stream){
      stream.getTracks().map(track => track.stop());
      pcRef.current.stream = undefined
      setStream(undefined)
    }
  }
  
  return (
    <View style={camStyle.container}>
      {stream && <RTCView stream={stream} style={camStyle.cam} />}
      <View style={camStyle.bottonContainer}>
        <View style={camStyle.buttonBar}>
          <Button title="Start" onPress={start} />
          <Button title="Stop" onPress={stop} />
        </View>
      </View>
    </View>
  );
}

