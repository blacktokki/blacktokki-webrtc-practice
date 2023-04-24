import { useRef } from "react";
import { mediaDevices, RTCPeerConnection, MediaStream, RTCSessionDescription, RTCIceCandidate } from "react-native-webrtc-web-shim";
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
export { RTCPeerConnection, RTCSessionDescription} from "react-native-webrtc-web-shim";

const onICEcandidate = (pc:any, message:any)=>{
	const _message = message.data.rtcMessage
		const candidate = new RTCIceCandidate(_message);
		if (pc) {
			console.log("ICE candidate Added");
			pc.addIceCandidate(candidate);
		}
}

const sendICEcandidate = (event, sendMessage, userId, target) => {
	// When you find a null candidate then there are no more candidates.
	// Gathering of candidates has finished.
	if ( !event.candidate ) { return; };
	// Send the event.candidate onto the person you're calling.
	// Keeping to Trickle ICE Standards, you should send the candidates immediately.
	sendMessage({type:'ICEcandidate', user:userId, data:{target, rtcMessage:event.candidate}})
  }

const createOffer = async(pcRefCurrent:{pc?:typeof RTCPeerConnection, stream?:typeof MediaStream, user?:{id:number}}, sendMessage:(data:any)=>void, user?:{username:string})=>{
  pcRefCurrent.stream && pcRefCurrent.pc.addStream( pcRefCurrent.stream );
  const offerDescription = await pcRefCurrent.pc.createOffer( sessionConstraints );
  await pcRefCurrent.pc.setLocalDescription( offerDescription );
  sendMessage({type:'call', user:pcRefCurrent.user?.id, data:{username:user.username, rtcMessage:offerDescription}})
}

export const useLocalCam = (sendMessage:(data:any)=>void, setStream:(stream:typeof MediaStream)=>void)=>{
	const pcRef = useRef<{pc?:typeof RTCPeerConnection, stream?:typeof MediaStream, user?:{id:number}}>({})
	return {
		start: async(user:{username:string}, stream?:typeof MediaStream)=>{
			console.log("start");
			if (!pcRef.current.stream) {
				try {
					pcRef.current.stream = stream || await mediaDevices.getUserMedia({audio:true, video:true});
					setStream(pcRef.current.stream)
					if (pcRef.current.pc)
					createOffer(pcRef.current, sendMessage, user)
				} catch (e) {
					console.error(e);
				}
			}
		},
		stop: ()=>{
			console.log("stop");
			if(pcRef.current.stream){
				pcRef.current.stream.getTracks().map(track => track.stop());
				pcRef.current.stream = undefined
				setStream(undefined)
    		}
		},
		websocketOnMessage: async(response, user)=>{
			let type = response.type;
			if (type == 'start'){
			  console.log('1 start')
			  const peerConnection = new RTCPeerConnection( peerConstraints );
			  peerConnection.addEventListener( 'icecandidate', event => sendICEcandidate(event, sendMessage, response.sender, 'remote'));
			  pcRef.current.pc = peerConnection
			  pcRef.current.user = {id:response.sender}
			  createOffer(pcRef.current, sendMessage, user)
			}
			
			if (type == "answer"){
			  console.log('3 answer')
			  const answerDescription = new RTCSessionDescription(response.data.rtcMessage);
			  await pcRef.current.pc.setRemoteDescription( answerDescription );
			}
			if (type == "ICEcandidate" && response.data.target=='local')
			  onICEcandidate(pcRef.current.pc, response)
		  }
	}
}

export const useRemoteCam = (sendMessage:(data:any)=>void, setStream:(stream:typeof MediaStream)=>void)=>{
	const pcRef = useRef<{pc?:RTCPeerConnection, user?:{username:string, id?:number}}>({})
	return {
		start: (username:string)=>{
			console.log("start");
			if (!pcRef.current.pc) {
			  pcRef.current.pc = new RTCPeerConnection( peerConstraints );
			  pcRef.current.user = {username}
			}
			sendMessage({type:'start', username, data:{}})
		},
		stop: () => {
			console.log("stop");
			if (pcRef.current.pc) {
			  // peerConnection._unregisterEvents();
			  setStream(undefined)
			  pcRef.current.pc.close();
			  pcRef.current.pc = undefined
			  pcRef.current.user = undefined
			}
		},
		websocketOnMessage: async(response)=>{
			let type = response.type;
			if (type == "call" && pcRef.current.user.username == response.data.username){
			  console.log('2 call')
			  const peerConnection = pcRef.current.pc
			  pcRef.current.user.id = response.sender
			  if (!peerConnection)
				return
			  peerConnection.addEventListener( 'icecandidate', event => sendICEcandidate(event, sendMessage, response.sender, 'local'));
			  const offerDescription = new RTCSessionDescription(response.data.rtcMessage);
			  await peerConnection.setRemoteDescription( offerDescription );
			  const answerDescription = await peerConnection.createAnswer( sessionConstraints );
			  await peerConnection.setLocalDescription( answerDescription );
			  sendMessage({type:'answer', user:pcRef.current.user?.id, data:{rtcMessage:peerConnection.localDescription}})
			  // Here is a good place to process candidates.
			  const streams = pcRef.current.pc.getRemoteStreams()
			  setStream(streams[streams.length - 1])
			}
			if (type == "ICEcandidate" && response.data.target=='remote' && pcRef.current.user.id == response.sender)
			  onICEcandidate(pcRef.current.pc, response)
		}
	}
}