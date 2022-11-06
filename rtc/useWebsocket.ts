import { useEffect, useRef } from "react";

let myName;

export const getName = ()=>{
    return myName
}

const createWebsocket = ()=>{
    const callSocket = new WebSocket('ws://localhost:8000/ws/');
    callSocket.onopen = event =>{
        myName = (Math.floor(Math.random()*100)).toString();
        console.log("name", myName)
        //let's send myName to the socket
        callSocket.send(JSON.stringify({
            type: 'login',
            data: {
                name:myName
            }
        }));
    }
    callSocket.addEventListener('close',(e) =>{
        console.warn('socket closed');
        socket = null
        if (myName){
            setTimeout(()=>{
                console.warn('socket reconnected');
                createWebsocket()
            }, 2000)
        }
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
        const interval = setInterval(()=>{
            if(socket){
                websocketRef.current = socket
                socketAddEventListener(onMessage, websocketRef)
                clearInterval(interval)
            }
        },2050)
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
        if (websocketRef.current){
            const listener = socketAddEventListener(onMessage, websocketRef)
            return ()=>listener()
        }
    }, [])
    return websocketRef
}