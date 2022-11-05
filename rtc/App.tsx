import React, { useEffect, useState } from "react";
import {SafeAreaView,StatusBar} from "react-native";
import LocalCam from "./LocalCam";
import RemoteCam from "./RemoteCam";
import VirtualCam from "./VirtualCam";

function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      {/* <VirtualCam/> */}
      <LocalCam/>
      <RemoteCam/>
    </SafeAreaView>
  );
}

export default App;
