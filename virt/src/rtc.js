const canvas = document.querySelector('#live2d');

const stream = canvas.captureStream();
const streamData = JSON.stringify(stream.getVideoTracks())

const peerConstraints = {
	iceServers: [
		{
			urls: 'stun:stun.l.google.com:19302'
		}
	]
};

const sessionConstraints = {
	mandatory: {
		OfferToReceiveAudio: true,
		OfferToReceiveVideo: true,
		VoiceActivityDetection: true
	}
};

const send = async(data)=>{
    if (window.ReactNativeWebView) 
        window.ReactNativeWebView.postMessage(JSON.stringify(data))
    else
        window.parent.postMessage(JSON.stringify(data), /*"http://localhost:19006/"*/ undefined)
}

const listener = sendData => {
    const { data, type } = sendData;
    if (type === "answer_call") {
        console.log('(virtual)3 call_answered')
        const answerDescription = new RTCSessionDescription(data.rtcMessage);
        peerConnection.setRemoteDescription( answerDescription );
    }
    if (type === "ICEcandidate") {
        const message = data.rtcMessage
        const candidate = new RTCIceCandidate({
            sdpMLineIndex: message.sdpMLineIndex,
            candidate: message.candidate
        });
        peerConnection.addIceCandidate(candidate);
    }
}
const nativeListener = event => {
    //console.log('child receive', event.data)
    if (event.data.startsWith?.('setImmediate')){
        return
    }
    if (event.data.type!= 'webpackOk') listener(JSON.parse(event.data))
}

const peerConnection = new RTCPeerConnection( peerConstraints );

const init = async()=>{
    console.log('(virtual)1 call_ready')
    peerConnection.addEventListener( 'icecandidate', event => {
        if ( !event.candidate ) { return; };
        send({type:'ICEcandidate', data:{rtcMessage:event.candidate}})
    });
    peerConnection.addStream( stream );
    const offerDescription = await peerConnection.createOffer( sessionConstraints );
    await peerConnection.setLocalDescription( offerDescription );
    send({type:'call', data:{rtcMessage:offerDescription}})
}

if (window.ReactNativeWebView) {
    /** android */
    document.addEventListener("message", nativeListener);
    /** ios */
    window.addEventListener("message", nativeListener);
    window.innerWidth = window.outerWidth
    window.innerHeight = window.outerHeight
}
else{
    window.addEventListener("message", nativeListener);
}

init()
send({type:'console', data:{w:window.innerWidth, h:window.innerHeight}})
send({type:'console', data:{w:window.outerWidth, h:window.outerHeight}})