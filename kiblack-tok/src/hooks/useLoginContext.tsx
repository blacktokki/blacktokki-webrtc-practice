import React, { createContext, useContext, useEffect, useState } from "react"
import { checkLogin } from "../apis"
import { User } from "../types"

const LoginContext = createContext<{user?:User|null, setUser:(user?:User|null)=>void}>({setUser:()=>{}});


export const LoginProvider = ({children}:{children:React.ReactNode})=>{
  const [user, setUser] = useState<User|null>();
  useEffect(()=>{
    if(user===undefined){
      checkLogin().then((user)=>{
        setUser(user)
      }).catch((e)=>{
        console.log(e)
        setUser(null)
      })
    }
  }, [user])
  return <LoginContext.Provider value={{user, setUser}}>
    {children}
  </LoginContext.Provider>
}

export default ()=>{
  const user = useContext(LoginContext)
  return user
}
