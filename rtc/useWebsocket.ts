import { useEffect, useRef } from "react";

const myName = (Math.random()*100).toString()

const createWebsocket = ()=>{
    const callSocket = new WebSocket('ws://localhost:8000/ws/');
    callSocket.onopen = event =>{
        console.log("name", myName)
        //let's send myName to the socket
        callSocket.send(JSON.stringify({
            type: 'login',
            data: {
                name:myName
            }
        }));
    }
    callSocket.addEventListener('close',() =>{
        console.warn('socket closed');
        socket = createWebsocket()
    })
    return callSocket
}
let socket = createWebsocket()

const socketAddEventListener = (onMessage, websocketRef)=>{
    const _onMessage = (ev: MessageEvent<any>) => {
        onMessage?.(JSON.parse(ev.data))
    }
    const _onClose =  ()=>{
        websocketRef.current.removeEventListener('message', _onMessage)
        websocketRef.current.removeEventListener('close', _onClose)
        websocketRef.current = socket
        socketAddEventListener(onMessage, websocketRef)
    }
    websocketRef.current.addEventListener('message', _onMessage)
    websocketRef.current.addEventListener('close', _onClose)
    return ()=> {
        websocketRef.current.removeEventListener('message', _onMessage)
        websocketRef.current.removeEventListener('close', _onClose)
    }
}

export default (onMessage?:(response:any)=>any)=>{
    const websocketRef = useRef(socket);
    useEffect(()=>{
        const listener = socketAddEventListener(onMessage, websocketRef)
        return ()=>listener()
    }, [])
    return websocketRef
}