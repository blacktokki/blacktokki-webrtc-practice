import React, { useEffect, useRef, useState } from "react";
import {Button, Platform, View, Text} from "react-native";
import WebView from "react-native-webview";
import useWebsocketContext from "./useWebsocketContext";
import { MediaStream, useLocalCam, camStyle} from "./webrtcCommon";
import {RTCPeerConnection, RTCSessionDescription, peerConstraints, sessionConstraints} from "./webrtcCommon/p2p"
import useAuthContext from "./useAuthContext";

const useViatualCam = ()=>{
  const webViewRef = useRef()
  const pcRef = useRef<{pc?:RTCPeerConnection}>({})
  const [stream, setStream] = useState<MediaStream>()
  const send = (data)=>{
    if (Platform.OS == 'web')
      (webViewRef.current as any).contentWindow.postMessage(JSON.stringify(data), 'http://localhost:3001/')
    else
      (webViewRef.current as any).postMessage(JSON.stringify(data))
  }
  const receive = async(sendData:{type:string, data:any})=>{
    const {type, data} = sendData
    if (type == "call"){
      console.log('(virtual)2 call_received')
      const peerConnection = new RTCPeerConnection( peerConstraints );
      pcRef.current.pc = peerConnection
      peerConnection.addEventListener( 'icecandidate', event => {
        if ( !event.candidate ) { return; };
        send({type:'ICEcandidate', data:{rtcMessage:event.candidate}})
      });
      const offerDescription = new RTCSessionDescription(data.rtcMessage);
      await peerConnection.setRemoteDescription( offerDescription );
      const answerDescription = await peerConnection.createAnswer( sessionConstraints );
      await peerConnection.setLocalDescription( answerDescription );
      send({type:'answer_call', data:{rtcMessage:peerConnection.localDescription}})
      const streams = pcRef.current.pc.getRemoteStreams()
      setStream(new MediaStream(streams[streams.length - 1]))
    }
    if (type == "ICEcandidate"){
      const candidate = new RTCIceCandidate(data.rtcMessage);
        console.log("ICE candidate Added");
        pcRef.current.pc.addIceCandidate(candidate);
    }
    if (type == "console"){
      console.log("(virtual)", data)
    }
  }
  const listener = (event)=>{
    if(Platform.OS == 'web'){
      try{
        // console.log('parent receive', event.data)
        receive(JSON.parse(event.data))
      }
      catch(e){
      }
    }
    else{
      receive(JSON.parse(event.nativeEvent.data))
    }
  }
  const virtualStop = ()=>{
    if(pcRef.current.pc){
      pcRef.current.pc.close();
      pcRef.current.pc = undefined
    }
    setStream(undefined)
  }
  return {webViewRef, stream, listener, virtualStop}
}

export default ()=>{
  const {webViewRef, stream, listener, virtualStop} = useViatualCam()
  const [active, setActive] = useState(false)
  //localCam code
  const {user} = useAuthContext()
  const {lastJsonMessage, sendJsonMessage} = useWebsocketContext()
  const {start, stop, websocketOnMessage} = useLocalCam(sendJsonMessage, ()=>{})
  useEffect(()=>{
    lastJsonMessage && websocketOnMessage(lastJsonMessage, user)
  }, [lastJsonMessage])
  useEffect(()=>{
    start(user, stream)
  },[stream])
  const _stop = ()=>{
    stop()
    virtualStop()
    setActive(false)
  }
  //localCam code end
  useEffect(()=>{
    if(Platform.OS == 'web'){
      window.addEventListener('message', listener)
      return ()=>window.removeEventListener('message', listener)
    }
  }, [])
  return <View style={camStyle.container}>{
    active?(
      Platform.OS == 'web'?
        <iframe ref={webViewRef} src={'http://localhost:3001/'} allow='camera *;microphone *' height="100%" width="100%"/>:
        <WebView
                ref={webViewRef}
                source={{ uri: 'http://localhost:3001/' }}
                originWhitelist={['*']}
                allowsInlineMediaPlayback
                javaScriptEnabled
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabledAndroid
                useWebkit
                startInLoadingState={true}
                style={camStyle.cam}
                onMessage={listener}
            />):
      undefined}
      <View style={camStyle.bottonContainer}>
        <View style={camStyle.buttonBar}>
          <Text style={{flex:1}}>{user?.username}</Text>
        </View>
        <View style={camStyle.buttonBar}>
            <Button title="Start" onPress={()=>setActive(true)} />
            <Button title="Stop" onPress={_stop} />
          </View>
      </View>
    </View>
}
