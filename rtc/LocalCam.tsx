import React, { useState, useRef, useEffect } from "react";
import {Button, View, Text} from "react-native";
import { RTCView, mediaDevices, RTCPeerConnection, MediaStream, RTCSessionDescription } from "react-native-webrtc-web-shim";
import useAuthContext from "./useAuthContext";
import useWebsocketContext from "./useWebsocketContext";
import { camStyle, onICEcandidate, peerConstraints, sendICEcandidate, sessionConstraints } from "./webrtcCommon";

export const createOffer = async(pcRefCurrent:{pc?:typeof RTCPeerConnection, stream?:typeof MediaStream, user?:{id:number}}, sendMessage:(data:any)=>void, user?:{username:string})=>{
  pcRefCurrent.stream && pcRefCurrent.pc.addStream( pcRefCurrent.stream );
  const offerDescription = await pcRefCurrent.pc.createOffer( sessionConstraints );
  await pcRefCurrent.pc.setLocalDescription( offerDescription );
  sendMessage({type:'call', user:pcRefCurrent.user?.id, data:{username:user.username, rtcMessage:offerDescription}})
}

export const websocketOnMessage = async(response, pcRef, user, sendMessage)=>{
  let type = response.type;
  if (type == 'start'){
    console.log('1 start')
    const peerConnection = new RTCPeerConnection( peerConstraints );
    peerConnection.addEventListener( 'icecandidate', event => sendICEcandidate(event, sendMessage, response.sender));
    pcRef.current.pc = peerConnection
    pcRef.current.user = {id:response.sender}
    createOffer(pcRef.current, sendMessage, user)
  }
  
  if (type == "answer"){
    console.log('3 answer')
    const answerDescription = new RTCSessionDescription(response.data.rtcMessage);
    await pcRef.current.pc.setRemoteDescription( answerDescription );
  }
  if (type == "ICEcandidate")
    onICEcandidate(pcRef.current.pc, pcRef.current.user, response, false)
}

export default ()=>{
  const pcRef = useRef<{pc?:typeof RTCPeerConnection, stream?:typeof MediaStream, user?:{id:number}}>({})
  const [stream, setStream] = useState<MediaStream>()
  const {user} = useAuthContext()
  const {lastJsonMessage, sendJsonMessage} = useWebsocketContext()
  useEffect(()=>{
    lastJsonMessage && websocketOnMessage(lastJsonMessage, pcRef, user, sendJsonMessage)
  
  }, [lastJsonMessage])

  const start = async () => {
    console.log("start");
    if (!pcRef.current.stream) {
      try {
        pcRef.current.stream = await mediaDevices.getUserMedia({audio:true, video:true});
        setStream(pcRef.current.stream)
        if (pcRef.current.pc)
          createOffer(pcRef.current, sendJsonMessage, user)
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
          <Text style={{flex:1}}>Username: {user?.username}</Text>
        </View>
        <View style={camStyle.buttonBar}>
          <Button title="Start" onPress={start} />
          <Button title="Stop" onPress={stop} />
        </View>
      </View>
    </View>
  );
}

