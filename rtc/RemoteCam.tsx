import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { RTCView, mediaDevices, RTCPeerConnection, MediaStream } from "react-native-webrtc-web-shim";
import useWebsocket from "./useWebsocket";

const peerConstraints = {
	iceServers: [
		{
			urls: 'stun:stun.l.google.com:19302'
		}
	]
};

const sessionConstraints = {
	mandatory: {
		OfferToReceiveAudio: true,
		OfferToReceiveVideo: true,
		VoiceActivityDetection: true
	}
};

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
      peerConnection.addEventListener( 'icecandidate', event => {
        // When you find a null candidate then there are no more candidates.
        // Gathering of candidates has finished.
        
        if ( !event.candidate ) { return; };
        // Send the event.candidate onto the person you're calling.
        // Keeping to Trickle ICE Standards, you should send the candidates immediately.
        websocketRef.current.send(JSON.stringify({type:'ICEcandidate', data:{user:response.data.caller, rtcMessage:event.candidate}}))
      });
      const offerDescription = new RTCSessionDescription(response.data.rtcMessage);
      await peerConnection.setRemoteDescription( offerDescription );
      const answerDescription = await peerConnection.createAnswer( sessionConstraints );
      await peerConnection.setLocalDescription( answerDescription );
      websocketRef.current.send(JSON.stringify({type:'answer_call', data:{caller:response.data.caller, rtcMessage:peerConnection.localDescription}}))
      // Here is a good place to process candidates.
      const streams = pcRef.current.pc.getRemoteStreams()
      setStream(streams[streams.length - 1])
    }
    if (type == "ICEcandidate" && pcRef.current.name == response.data.sender){
      const message = response.data.rtcMessage
      const candidate = new RTCIceCandidate({
          sdpMLineIndex: message.sdpMLineIndex,
          candidate: message.candidate
      });
      if (pcRef.current.pc) {
          console.log("ICE candidate Added");
          pcRef.current.pc.addIceCandidate(candidate);
      }
    }
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
    <View style={{ flex: 1, borderWidth:1}}>
      {stream && <RTCView stream={stream} style={{ flex: 1, borderWidth:5}} />}
      <View style={{position:"absolute", width:'100%', height:'100%', justifyContent:'flex-end'}}>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {stream?
            <Text style={{borderWidth:1, flex:1}}>{name}</Text>:
            <TextInput style={{borderWidth:1, flex:1}} value={name} onChangeText={setName}/>
          }
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Button title="Start" onPress={start} />
          <Button title="Stop" onPress={stop} />
        </View>
      </View>
    </View>
  );
}

