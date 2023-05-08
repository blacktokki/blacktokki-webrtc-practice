import React, { Context, createContext, useContext, useEffect, useState } from "react"
import useWebSocket from "react-use-websocket"
// @ts-ignore
import {API_URL} from "@env"
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import useAuthContext from "./useAuthContext";
const [SCHEMA, DOMAIN] = `${API_URL}`.split('://')

type WebsocketContextType = {lastJsonMessage:any, sendJsonMessage:SendJsonMessage }
const WebSocketInternalProvider = ({children, path, Context, useBackground}:{children:React.ReactNode, path:string, Context:Context<WebsocketContextType>, useBackground?:boolean})=>{
  const {token} = useAuthContext()
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(`${SCHEMA=='https'?'wss':'ws'}://${DOMAIN}/${path}`,{
    shouldReconnect: (closeEvent) => true,
    protocols: token?['Authorization',  token]:undefined,
    onOpen: (e)=>{console.log(`success websocket connection(${path})`)},
    onClose: (e)=> {console.log(`closed websocket connection(${path})`)},
  }, token!=null)
  return (token==null)?<>{children}</>:<Context.Provider value={{lastJsonMessage, sendJsonMessage}}>
      {children}
    </Context.Provider>
}


const WebSocketContext = createContext<{lastJsonMessage:any, sendJsonMessage:SendJsonMessage }>({lastJsonMessage:undefined, sendJsonMessage:()=>{}});

export const WebSocketProvider = ({disable, children}:{disable?:boolean, children:React.ReactNode})=>{
  return disable?<></>:<WebSocketInternalProvider path={'messenger/ws/rtc/'} Context={WebSocketContext} useBackground>
    {children}
  </WebSocketInternalProvider>
}

export default ()=>{
  const webSocketContext = useContext(WebSocketContext)
  return webSocketContext
}

