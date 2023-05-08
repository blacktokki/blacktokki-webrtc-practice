import React, { useCallback, useRef, useState, useMemo } from "react";
//@ts-ignore
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

const mediaConstraints = {audio:true, video:{framerate:30}}

//@ts-ignore
export {MediaStream, RTCPeerConnection, RTCSessionDescription} from "react-native-webrtc-web-shim";

const onICEcandidate = (pc:typeof RTCPeerConnection, message:any)=>{
	const _message = message.data.rtcMessage
		const candidate = new RTCIceCandidate(_message);
		if (pc) {
			console.log("ICE candidate Added");
			pc.addIceCandidate(candidate);
		}
}

const sendICEcandidate = (event:any, sendMessage:(data:any)=>void, receiver:string, target:string) => {
	// When you find a null candidate then there are no more candidates.
	// Gathering of candidates has finished.
	if ( !event.candidate ) { return; };
	// Send the event.candidate onto the person you're calling.
	// Keeping to Trickle ICE Standards, you should send the candidates immediately.
	sendMessage({type:'ICEcandidate', receiver, data:{target, rtcMessage:event.candidate}})
  }

const BAND_WIDTH = 8000

const optimizeSdp = (offerDescription:RTCSessionDescription)=>{
	var arr = offerDescription.sdp.split('\r\n');
	arr.forEach((str:string, i:number) => {
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

const createOffer = async(pcRefCurrent:{pc?:typeof RTCPeerConnection, receiver:string}, sendMessage:(data:any)=>void, stream:typeof MediaStream, target:string, user?:{name:string})=>{
	stream && pcRefCurrent.pc.addStream( stream );
	const offerDescription = optimizeSdp((await pcRefCurrent.pc.createOffer( sessionConstraints )));
	await pcRefCurrent.pc.setLocalDescription( offerDescription );
	sendMessage({type:'call', receiver:pcRefCurrent.receiver, data:{target, name:user?.name, rtcMessage:offerDescription}})
}

export const useLocalCam = (sendMessage:(data:any)=>void)=>{
	const pcRef = useRef<Record<number,{pc:typeof RTCPeerConnection, receiver:string}>>({})
	const [sender, setSender] = useState<string>()
	const [_stream, setStream] = useState<MediaStream>()
	const isPlay = useMemo(()=>_stream?true:false, [_stream])
	const CustomRTCView = useCallback(React.memo(({style}:{style:any})=>(_stream?<RTCView stream={_stream} style={style} videoProps={{height:'100%'}} />:<></>)) , [_stream])
	const start = useCallback(async(user:{name:string}, stream?:typeof MediaStream, mode?:'camera'|'display')=>{
		console.log("start");
		if (!_stream || mode!==undefined) {
			try {
				let newStream:typeof MediaStream;
				if(mode == 'camera'){
					newStream = await mediaDevices.getUserMedia(mediaConstraints)
				}
				else if (mode == 'display'){
					newStream = await mediaDevices.getDisplayMedia(mediaConstraints)
				}
				else{
					newStream = stream || await mediaDevices.getUserMedia(mediaConstraints).catch((e:any)=>mediaDevices.getDisplayMedia(mediaConstraints));
				}
				setStream(newStream)
				Object.entries(pcRef.current).map(([k, v])=>{
					createOffer(v, sendMessage, newStream, 'guest', user)
				})
			} catch (e) {
				console.error(e);
			}
		}
	}, [_stream])
	const stop = useCallback(()=>{
		console.log("stop");
		if(_stream){
			_stream.getTracks().map((track:any) => track.stop());
			setStream(undefined)
		}
	}, [_stream])
	return {
		start,
		stop,
		websocketOnMessage: async(response:any, user:{name:string})=>{
			let type = response.type;
			if (type == 'connection'){
				setSender(response.data.channel_name)
			}
			if (type == 'start' && response.data.target=='host'){
			  console.log('1 start')
			  const peerConnection = new RTCPeerConnection( peerConstraints );
			  peerConnection.addEventListener( 'icecandidate', (event:any) => sendICEcandidate(event, sendMessage, response.sender, 'guest'));
			  pcRef.current[response.sender] = {pc:peerConnection, receiver: response.sender}
			  createOffer(pcRef.current[response.sender], sendMessage, _stream, 'guest', user)
			}
			
			if (type == "answer" && response.data.target == 'host'){
			  console.log('3 answer')
			  const peerConnection = pcRef.current[response.sender].pc
			  const answerDescription = new RTCSessionDescription(response.data.rtcMessage);
			  await peerConnection.setRemoteDescription( answerDescription );
			  // const streams = pcRef.current.pc.getRemoteStreams()
			  // setMirrorStream(streams[streams.length - 1])
			}
			if (type == "ICEcandidate" && response.data.target=='host'){
				const peerConnection = pcRef.current[response.sender].pc
				onICEcandidate(peerConnection, response)
			}
		},
		CustomRTCView,
		isPlay,
		sender,
		// renderMirrorView,
	}
}

export const useRemoteCam = (sendMessage:(data:any)=>void)=>{
	const pcRef = useRef<{pc?:RTCPeerConnection, receiver?:string, statsInterval?:any}>({})
	const [user, setUser] = useState<{name:string}>()
	const [_stream, setStream] = useState<MediaStream>()
	const CustomRTCView = useCallback(React.memo((style:any)=>_stream?<RTCView stream={_stream} style={style} videoProps={{height:'100%'}} />:<></>), [_stream])
	const isPlay = useMemo(()=>_stream?true:false, [_stream])
	const start = useCallback((receiver:string)=>{
		console.log("start");
		if (!pcRef.current.pc) {
		  pcRef.current.pc = new RTCPeerConnection( peerConstraints );
		  pcRef.current.receiver = receiver
		}
		if (!_stream){
			sendMessage({type:'start', receiver, data:{'target': 'host'}})
		}
	}, [_stream])
	const stop = () => {
		console.log("stop");
		if (pcRef.current.pc) {
		  // peerConnection._unregisterEvents();
		  setStream(undefined)
		  pcRef.current.pc.close();
		  pcRef.current.pc = undefined
		  pcRef.current.receiver = undefined
		  clearInterval(pcRef.current.statsInterval)
		}
	}
	return {
		start,
		stop,
		websocketOnMessage: async(response:any)=>{
			let type = response.type;
			if (type == 'start' && response.data.target=='guest' && response.sender == pcRef.current?.receiver){
				console.log('(remote)1 start')
				const peerConnection = pcRef.current.pc
				setUser({name: response.data.name})
				peerConnection.addEventListener('icecandidate', (event:any) => sendICEcandidate(event, sendMessage, response.sender, 'host'));
				peerConnection.addEventListener('iceconnectionstatechange', (e:any)=>{
					if (pcRef.current.pc.iceConnectionState == 'connected'){
						let activeStream = false
						pcRef.current.statsInterval = setInterval(async()=>{
							const stats = await pcRef.current.pc.getStats(null)
							let statsOutput = "";
							let framePerSecond = undefined
							stats.forEach((report:any) => {
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
				await createOffer({pc:pcRef.current.pc, receiver:response.sender}, sendMessage, _stream, 'host', user)
			}  
			if (type == "answer" && response.data.target=='guest' && response.sender == pcRef.current?.receiver){
				console.log('(remote)3 answer')
				const answerDescription = new RTCSessionDescription(response.data.rtcMessage);
				await pcRef.current.pc.setRemoteDescription( answerDescription );
				const streams = pcRef.current.pc.getRemoteStreams()
				setStream(streams[streams.length - 1])
				sendMessage({type:'end', receiver:pcRef.current.receiver, data:{}})
			}
			if (type == "call" && response.sender == pcRef.current?.receiver){
			  console.log('2 call')
			  const peerConnection = pcRef.current.pc
			  setUser({name:response.data.name})
			  if (!peerConnection)
				return
			  peerConnection.addEventListener( 'icecandidate', (event:any) => sendICEcandidate(event, sendMessage, response.sender, 'host'));
			  const offerDescription = new RTCSessionDescription(response.data.rtcMessage);
			  await peerConnection.setRemoteDescription( offerDescription );
			  const answerDescription = await peerConnection.createAnswer( sessionConstraints );
			  await peerConnection.setLocalDescription( answerDescription );
			  sendMessage({type:'answer', receiver:pcRef.current.receiver, data:{target:'host', rtcMessage:peerConnection.localDescription}})
			  // Here is a good place to process candidates.
			  const streams = pcRef.current.pc.getRemoteStreams()
			  setStream(streams[streams.length - 1])
			}
			if (type == "ICEcandidate" && response.data.target=='guest' && response.sender == pcRef.current?.receiver)
			  onICEcandidate(pcRef.current.pc, response)
		},
		CustomRTCView,
		user,
		isPlay
	}
}