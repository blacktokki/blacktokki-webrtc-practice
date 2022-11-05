import React, { useEffect, useState } from "react";
import {Platform, View} from "react-native";
import WebView from "react-native-webview";

export default ()=>{
  
  return <View style={{ flex: 1, borderWidth:1}}>{Platform.OS == 'web'?
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
      />}
    </View>
}
