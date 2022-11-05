import React, { useEffect, useState } from "react";
import {SafeAreaView,StatusBar} from "react-native";
import LocalCam from "./LocalCam";
import RemoteCam from "./RemoteCam";

function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LocalCam/>
      <RemoteCam/>
    </SafeAreaView>
  );
}

export default App;
