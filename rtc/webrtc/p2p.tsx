import { useCallback, useRef, useState, useMemo } from "react";
import { RTCView, mediaDevices, RTCPeerConnection, MediaStream, RTCSessionDescription, RTCIceCandidate } from "react-native-webrtc-web-shim";
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
export {MediaStream, RTCPeerConnection, RTCSessionDescription} from "react-native-webrtc-web-shim";

const onICEcandidate = (pc:typeof RTCPeerConnection, message:any)=>{
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

const BAND_WIDTH = 8000

const optimizeSdp = (offerDescription:RTCSessionDescription)=>{
	var arr = offerDescription.sdp.split('\r\n');
	arr.forEach((str, i) => {
		if (/^a=fmtp:\d*/.test(str)) {
			arr[i] = str + `;x-google-max-bitrate=${BAND_WIDTH};x-google-min-bitrate=${BAND_WIDTH};x-google-start-bitrate=${BAND_WIDTH}`;
		} else if (/^a=mid:(0|video)/.test(str)) { // if with audio then 0=>1
			arr[i] += `\r\nb=AS:${BAND_WIDTH}`;
		}
	});
  	return new RTCSessionDescription({
    	type: offerDescription.type,
    	sdp: arr.join('\r\n'),
  	})
}

const createOffer = async(pcRefCurrent:{pc?:typeof RTCPeerConnection, user?:{id:number}}, sendMessage:(data:any)=>void, stream:typeof MediaStream, target, owner?:{username:string})=>{
	stream && pcRefCurrent.pc.addStream( stream );
	const offerDescription = optimizeSdp((await pcRefCurrent.pc.createOffer( sessionConstraints )));
	await pcRefCurrent.pc.setLocalDescription( offerDescription );
	sendMessage({type:'call', user:pcRefCurrent.user?.id, data:{target, username:owner.username, rtcMessage:offerDescription}})
}

export const useLocalCam = (sendMessage:(data:any)=>void)=>{
	const pcRef = useRef<{pc?:typeof RTCPeerConnection, user?:{id:number}}>({})
	const [_stream, setStream] = useState<MediaStream>()
	// const [_mirrorStream, setMirrorStream] = useState<MediaStream>()
	const renderRTCView = useCallback((style)=>_stream && <RTCView stream={_stream} style={style} /> , [_stream])
	// const renderMirrorView = useCallback((style)=>_mirrorStream && <RTCView stream={_mirrorStream} style={style} /> , [_mirrorStream])
	const start = useCallback(async(owner:{username:string}, stream?:typeof MediaStream)=>{
		console.log("start");
		if (!_stream) {
			try {
				const newStream = stream || await mediaDevices.getUserMedia({audio:true, video:true}).catch(e=>mediaDevices.getDisplayMedia({audio:true, video:{framerate:30}}));
				setStream(newStream)
				if (pcRef.current.pc)
					createOffer(pcRef.current, sendMessage, newStream, 'remote', owner)
			} catch (e) {
				console.error(e);
			}
		}
	}, [_stream])
	const stop = useCallback(()=>{
		console.log("stop");
		if(_stream){
			_stream.getTracks().map(track => track.stop());
			setStream(undefined)
		}
	}, [_stream])
	return {
		start,
		stop,
		websocketOnMessage: async(response, owner)=>{
			let type = response.type;
			if (type == 'start' && response.data.username == undefined){
			  console.log('1 start')
			  const peerConnection = new RTCPeerConnection( peerConstraints );
			  peerConnection.addEventListener( 'icecandidate', event => sendICEcandidate(event, sendMessage, response.sender, 'remote'));
			  pcRef.current.pc = peerConnection
			  pcRef.current.user = {id:response.sender}
			  createOffer(pcRef.current, sendMessage, _stream, 'remote', owner)
			}
			
			if (type == "answer" && response.data.target == 'local'){
			  console.log('3 answer')
			  const answerDescription = new RTCSessionDescription(response.data.rtcMessage);
			  await pcRef.current.pc.setRemoteDescription( answerDescription );
			  // const streams = pcRef.current.pc.getRemoteStreams()
			  // setMirrorStream(streams[streams.length - 1])
			}
			if (type == "ICEcandidate" && response.data.target=='local')
			  onICEcandidate(pcRef.current.pc, response)
		},
		renderRTCView,
		// renderMirrorView,
	}
}

export const useRemoteCam = (sendMessage:(data:any)=>void)=>{
	const pcRef = useRef<{pc?:RTCPeerConnection, user?:{username:string, id?:number}, statsInterval?:any}>({})
	const [_stream, setStream] = useState<MediaStream>()
	const renderRTCView = useCallback((style)=>_stream && <RTCView stream={_stream} style={style} /> , [_stream])
	const isPlay = useMemo(()=>_stream?true:false, [_stream])
	const start = useCallback((username:string)=>{
		console.log("start");
		if (!pcRef.current.pc) {
		  pcRef.current.pc = new RTCPeerConnection( peerConstraints );
		  pcRef.current.user = {username}
		}
		if (!_stream){
			sendMessage({type:'start', username, data:{}})
		}
	}, [_stream])
	const stop = () => {
		console.log("stop");
		if (pcRef.current.pc) {
		  // peerConnection._unregisterEvents();
		  setStream(undefined)
		  pcRef.current.pc.close();
		  pcRef.current.pc = undefined
		  pcRef.current.user = undefined
		  clearInterval(pcRef.current.statsInterval)
		}
	}
	return {
		start,
		stop,
		websocketOnMessage: async(response)=>{
			let type = response.type;
			if (type == 'start' && response.data.username && response.data.username == pcRef.current.user.username){
				console.log('(remote)1 start')
				const peerConnection = pcRef.current.pc
			  	pcRef.current.user.id = response.sender
				peerConnection.addEventListener('icecandidate', event => sendICEcandidate(event, sendMessage, response.sender, 'local'));
				peerConnection.addEventListener('iceconnectionstatechange', e=>{
					if (pcRef.current.pc.iceConnectionState == 'connected'){
						let activeStream = false
						pcRef.current.statsInterval = setInterval(async()=>{
							const stats = await pcRef.current.pc.getStats(null)
							let statsOutput = "";
							let framePerSecond = undefined
							stats.forEach((report) => {
								if (report.type === "inbound-rtp" && report.kind === "video") {
									Object.keys(report).forEach((statName) => {
										statsOutput += `${statName}: ${report[statName]}\n`;
									});
									framePerSecond = report.framesPerSecond
								}
							});
							console.log(activeStream, framePerSecond)
							if (framePerSecond != undefined){
								activeStream = true
							}
							else if (activeStream){
								stop()
							}
							console.log(new Date().toTimeString().split(' ')[0], statsOutput)
						}, 1000);
					}
					else if (pcRef.current.pc.iceConnectionState == 'failed'){
						stop()
					}
				})
				// peerConnection.addTransceiver('audio', {
				// 	direction: 'recvonly'
				// });
				peerConnection.addTransceiver('video', {
					direction: 'recvonly'
				});
				await createOffer({pc:pcRef.current.pc, user:{id:response.sender}}, sendMessage, _stream, 'local', pcRef.current.user)
			}  
			if (type == "answer" && response.data.target=='remote' && response.sender == pcRef.current.user.id){
				console.log('(remote)3 answer')
				const answerDescription = new RTCSessionDescription(response.data.rtcMessage);
				await pcRef.current.pc.setRemoteDescription( answerDescription );
				const streams = pcRef.current.pc.getRemoteStreams()
				setStream(streams[streams.length - 1])
				sendMessage({type:'end', username:pcRef.current.user.username, data:{}})
			}
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
			  sendMessage({type:'answer', user:pcRef.current.user?.id, data:{target:'local', rtcMessage:peerConnection.localDescription}})
			  // Here is a good place to process candidates.
			  const streams = pcRef.current.pc.getRemoteStreams()
			  setStream(streams[streams.length - 1])
			}
			if (type == "ICEcandidate" && response.data.target=='remote' && pcRef.current.user.id == response.sender)
			  onICEcandidate(pcRef.current.pc, response)
		},
		renderRTCView,
		isPlay
	}
}