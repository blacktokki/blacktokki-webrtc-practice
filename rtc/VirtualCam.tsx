import React, { useEffect, useState } from "react";
import {Button, Platform, View} from "react-native";
import WebView from "react-native-webview";
import { camStyle } from "./webrtcCommon";

export default ()=>{
  const start = async () => {}
  const stop = async () => {}
  return <View style={camStyle.container}>{Platform.OS == 'web'?
    <iframe src={'http://localhost:3001/'} allow='camera *;microphone *' height="100%" width="100%"/>:
    <WebView
            source={{ uri: 'http://localhost:3001/' }}
            originWhitelist={['*']}
            allowsInlineMediaPlayback
            javaScriptEnabled
            scalesPageToFit
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabledAndroid
            useWebkit
            startInLoadingState={true}
            style={camStyle.cam}
        />}
      <View style={camStyle.bottonContainer}>
        <View style={camStyle.buttonBar}>
            <Button title="Start" onPress={start} />
            <Button title="Stop" onPress={stop} />
          </View>
      </View>
    </View>
}
