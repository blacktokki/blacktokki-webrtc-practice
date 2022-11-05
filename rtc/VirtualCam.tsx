import React, { useEffect, useRef, useState } from "react";
import {Button, Platform, View} from "react-native";
import WebView from "react-native-webview";
import { RTCView, RTCPeerConnection } from "react-native-webrtc-web-shim";
import { camStyle, onICEcandidate, peerConstraints, sessionConstraints } from "./webrtcCommon";

export default ()=>{
  const webViewRef = useRef()
  const pcVirtualRef = useRef<{pc?:RTCPeerConnection}>({})
  const [virtualStream, setVirtualStream] =  useState<MediaStream>()
  const start = async () => {}
  const stop = async () => {}
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
      pcVirtualRef.current.pc = peerConnection
      peerConnection.addEventListener( 'icecandidate', event => {
        if ( !event.candidate ) { return; };
        send({type:'ICEcandidate', data:{rtcMessage:event.candidate}})

      });
      const offerDescription = new RTCSessionDescription(data.rtcMessage);
      await peerConnection.setRemoteDescription( offerDescription );
      const answerDescription = await peerConnection.createAnswer( sessionConstraints );
      await peerConnection.setLocalDescription( answerDescription );
      send({type:'answer_call', data:{rtcMessage:peerConnection.localDescription}})
      const streams = pcVirtualRef.current.pc.getRemoteStreams()
      setVirtualStream(streams[streams.length - 1])
      
    }
    if (type == "(virtual)ICEcandidate"){
      onICEcandidate(pcVirtualRef.current.pc, undefined, data, true)
    }
  }
  useEffect(()=>{
    if(Platform.OS == 'web'){
      const webListener = (event)=>{
        try{
          console.log('parent receive', event.data)
          receive(JSON.parse(event.data))
        }
        catch(e){
        }
      }
      window.addEventListener('message', webListener)
      return ()=>window.removeEventListener('message', webListener)
    }
  }, [])
  return <View style={camStyle.container}>{Platform.OS == 'web'?
    <iframe ref={webViewRef} src={'http://localhost:3001/'} allow='camera *;microphone *' height="100%" width="100%"/>:
    <WebView
            ref={webViewRef}
            source={{ uri: 'http://localhost:3001/' }}
            originWhitelist={['*']}
            allowsInlineMediaPlayback
            javaScriptEnabled
            scalesPageToFit
            mediaPlaybackRequiresUserAction={false}
            // javaScriptEnabledAndroid
            // useWebkit
            startInLoadingState={true}
            style={camStyle.cam}
            onMessage={({ nativeEvent: { data } })=>{receive(JSON.parse(data))}}
        />}
      <View style={camStyle.bottonContainer}>
        {/* {virtualStream && <RTCView stream={virtualStream} style={{width:'20%', height:'20%'}} objectFit={'cover'} />} */}
        <View style={camStyle.buttonBar}>
            <Button title="Start" onPress={start} />
            <Button title="Stop" onPress={stop} />
          </View>
      </View>
    </View>
}
