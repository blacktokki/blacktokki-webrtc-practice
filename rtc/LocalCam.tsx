import React, { useEffect, useState, useRef } from "react";
import {Button, Text, TextInput, View} from "react-native";
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
      peerConnection.addEventListener( 'icecandidate', event => {
      
        // When you find a null candidate then there are no more candidates.
        // Gathering of candidates has finished.
        if ( !event.candidate ) { return; };
        
        // Send the event.candidate onto the person you're calling.
        // Keeping to Trickle ICE Standards, you should send the candidates immediately.
        websocketRef.current.send(JSON.stringify({type:'ICEcandidate', data:{user:response.data.sender, rtcMessage:event.candidate}}))
      });
      pcRef.current.pc = peerConnection
      pcRef.current.name = response.data.sender
      createOffer(pcRef.current, websocketRef)
    }
    
    if (type == "call_answered"){
      console.log('3 call_answered')
      const answerDescription = new RTCSessionDescription(response.data.rtcMessage);
      await pcRef.current.pc.setRemoteDescription( answerDescription );
    }
    if (type == "ICEcandidate" && pcRef.current.name == response.data.sender){
      const message = response.data.rtcMessage
      const candidate = new RTCIceCandidate({
          sdpMLineIndex: message.sdpMLineIndex,
          candidate: message.candidate
      });

      if (pcRef.current.pc) {
          console.log("ICE candidate Added");
          pcRef.current.pc.remoteDescription && pcRef.current.pc.addIceCandidate(candidate);
      } else {
          console.log("ICE candidate Pushed");
          // iceCandidatesFromCaller.push(candidate);
      }
    }
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
    if(pcRef.current.stream){
      stream.getTracks().map(
        track => track.stop()
        //track => track.enabled = false
      );
      pcRef.current.stream = undefined
      setStream(undefined)
    }
  }
  
  return (
    <View style={{ flex: 1, borderWidth:1}}>
      {stream && <RTCView stream={stream} style={{ flex: 1, borderWidth:5}} />}
      <View style={{position:"absolute", width:'100%', height:'100%', justifyContent:'flex-end'}}>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Button title="Start" onPress={start} />
          <Button title="Stop" onPress={stop} />
        </View>
      </View>
    </View>
  );
}

