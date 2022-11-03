import React, { useEffect, useState } from "react";
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RTCView, mediaDevices } from "react-native-webrtc-web-shim";
import WebView from "react-native-webview";

function App() {
  const [stream, setStream] = useState(null);

  const start = async () => {
    console.log("start");
    if (!stream) {
      let s;
      try {
        // as = await mediaDevices.getDisplayMedia({video:true, mirror: true})
        s = await mediaDevices.getUserMedia({audio:true, video:true});
        setStream(s);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stop = () => {
    console.log("stop");
    if (stream) {
      stream.release();
      setStream(null);
    }
  };
  console.log(stream)
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>hi</Text>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1, borderWidth:1}}>
        
        {/* {stream && <RTCView stream={stream} style={{ flex: 1, borderWidth:5}} />} */}
        {/* <iframe src={'http://localhost:3000/live2d/'} allow='camera *;microphone *' height="100%" width="100%"/> */}
        {/* <WebView
          source={{ uri: 'https://kalidokit-live2d.glitch.me/' }}
          originWhitelist={['*']}
          allowsInlineMediaPlayback
          javaScriptEnabled
          scalesPageToFit
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabledAndroid
          useWebkit
          startInLoadingState={true}
      /> */}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Button title="Start" onPress={start} />
        <Button title="Stop" onPress={stop} />
      </View>
    </SafeAreaView>
  );
}

export default App;
