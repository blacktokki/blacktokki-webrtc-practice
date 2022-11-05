import {StyleSheet} from "react-native";
import { RTCIceCandidate } from "react-native-webrtc-web-shim";

export const peerConstraints = {
	iceServers: [
		{
			urls: 'stun:stun.l.google.com:19302'
		}
	]
};

export const sessionConstraints = {
	mandatory: {
		OfferToReceiveAudio: true,
		OfferToReceiveVideo: true,
		VoiceActivityDetection: true
	}
};

export const onICEcandidate = (pc:any, name:string, data:any, ignoreRemoteDesc:boolean)=>{
	if(name == data.sender){
	const message = data.rtcMessage
		const candidate = new RTCIceCandidate({
			sdpMLineIndex: message.sdpMLineIndex,
			candidate: message.candidate
		});
		if (pc) {
			console.log("ICE candidate Added");
			(ignoreRemoteDesc || pc.remoteDescription) && pc.addIceCandidate(candidate);
		}
	}
}

export const sendICEcandidate = (event, websocket, caller) => {
	// When you find a null candidate then there are no more candidates.
	// Gathering of candidates has finished.
	if ( !event.candidate ) { return; };
	// Send the event.candidate onto the person you're calling.
	// Keeping to Trickle ICE Standards, you should send the candidates immediately.
	websocket.send(JSON.stringify({type:'ICEcandidate', data:{user:caller, rtcMessage:event.candidate}}))
  }

export const camStyle = StyleSheet.create({
	container:{ flex: 1, borderWidth:1},
	cam:{ flex: 1, borderWidth:5},
	bottonContainer: {position:"absolute", width:'100%', height:'100%', justifyContent:'flex-end'},
	buttonBar: { flexDirection: "row", justifyContent: "space-around" }
})