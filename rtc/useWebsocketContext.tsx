import React, { createContext, useContext, useEffect, useState } from "react"
import useWebSocket from "react-use-websocket"
// @ts-ignore
import {API_URL} from "@env"
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import useAuthContext from "./useAuthContext";

const WebSocketContext = createContext<{lastJsonMessage:any, sendJsonMessage:SendJsonMessage }>({lastJsonMessage:null, sendJsonMessage:()=>{}});
const [SCHEMA, DOMAIN] = `${API_URL}`.split('://')

const WebSocketProviderInternal = ({token, children}:{token:string, children:React.ReactNode})=>{
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(`${SCHEMA=='https'?'wss':'ws'}://${DOMAIN}/messenger/ws/rtc/`,{
    shouldReconnect: (closeEvent) => true,
    protocols: ['Authorization', token],
    onOpen: (e)=>{console.log('success websocket connection')}
  })
  return <WebSocketContext.Provider value={{lastJsonMessage, sendJsonMessage}}>
  {children}
</WebSocketContext.Provider>
}

export const WebSocketProvider = ({disable, children}:{disable?:boolean, children:React.ReactNode})=>{
  const {token} = useAuthContext()
  return (disable || !token)?<>{children}</>:<WebSocketProviderInternal token={token}>
    {children}
  </WebSocketProviderInternal>
}

export default ()=>{
  const webSocketContext = useContext(WebSocketContext)
  return webSocketContext
}

