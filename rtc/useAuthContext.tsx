import { createContext, useContext, useEffect, useState } from "react";
// @ts-ignore
import {API_URL} from "@env"
import axios from "axios";
const AuthContext = createContext<{user:any, token:string|null}>({user:{}, token:null})
export const ENDPOINT = `${API_URL}/messenger`

export const AuthProvider = ({children}:{children:React.ReactNode})=>{
    const [user, setUser] = useState()
    const [token, setToken] = useState(null)
    useEffect(()=>{
        axios.post(`${ENDPOINT}/api-token-auth/`, {username:'guest', password:'guest'}, {withCredentials:true}).then(r=>{
          if(r.status == 200){  
            axios.get(`${ENDPOINT}/api/v1/users/?_self=true`, {withCredentials:true, headers:{'Authorization':`JWT ${r.data}`}}).then(r2=>{
              if(r2.data && r2.data.length){
                setToken(r.data)
                console.log(r2.data[0])
                setUser(r2.data[0])
              }
            })
          }
        });
    }, [])
    return  <AuthContext.Provider value={{user, token}}>
        {children}
    </AuthContext.Provider>
} 

export default ()=>{
    const authContext = useContext(AuthContext)
  return authContext
}