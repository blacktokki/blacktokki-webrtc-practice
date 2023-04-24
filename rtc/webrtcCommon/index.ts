import {StyleSheet} from "react-native";
export { RTCView, MediaStream } from "react-native-webrtc-web-shim"
export {useLocalCam, useRemoteCam} from "./p2p"

export const camStyle = StyleSheet.create({
	container:{ flex: 1, borderWidth:1},
	cam:{ flex: 1, borderWidth:5},
	bottonContainer: {position:"absolute", width:'100%', height:'100%', justifyContent:'flex-end'},
	buttonBar: { flexDirection: "row", justifyContent: "space-around" }
})