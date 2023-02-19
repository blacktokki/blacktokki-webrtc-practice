import React from "react";
import {SafeAreaView,StatusBar} from "react-native";
import LocalCam from "./LocalCam";
import RemoteCam from "./RemoteCam";
import { AuthProvider } from "./useAuthContext";
import {WebSocketProvider} from "./useWebsocketContext";
// import VirtualCam from "./VirtualCam";

function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <AuthProvider>
        <WebSocketProvider>
          {/* <VirtualCam/> */}
          <LocalCam/>
          <RemoteCam/>
        </WebSocketProvider>
      </AuthProvider>
    </SafeAreaView>
  );
}

export default App;
