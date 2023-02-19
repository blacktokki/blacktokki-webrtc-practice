import React from "react";
import {SafeAreaView,StatusBar} from "react-native";
import LocalCam from "./LocalCam";
import RemoteCam from "./RemoteCam";
// @ts-ignore
import {CAM_MODE} from "@env"
import { AuthProvider } from "./useAuthContext";
import {WebSocketProvider} from "./useWebsocketContext";
import VirtualCam from "./VirtualCam";

function App() {
  const camMode = `${CAM_MODE}`
  console.log('cam mode: ', camMode)
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <AuthProvider>
        <WebSocketProvider>
          {camMode == 'VIRTUAL'?<VirtualCam/>:<LocalCam/>}
          <RemoteCam/>
        </WebSocketProvider>
      </AuthProvider>
    </SafeAreaView>
  );
}

export default App;
