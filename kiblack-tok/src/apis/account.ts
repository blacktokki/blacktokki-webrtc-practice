
import { Group, User } from '../types';
import axios from './axios';

export const login = async(username:string, password:string) => {
    const r = await axios.get("/csrf/")
    var bodyFormData = new FormData();
    bodyFormData.append('csrfmiddlewaretoken', r.data)
    bodyFormData.append('username', username)
    bodyFormData.append('password', password)
    bodyFormData.append('submit', 'Log in')
    const r2 = await axios.post("/api-auth/login/", bodyFormData, {headers: {"Content-Type": "multipart/form-data"}})
    if(r2.status == 200){
        return await checkLogin()
    }
}

export const logout = async() => {
    return await axios.get("/api-auth/logout/")
}

export const guestLogin =  async() => {
    return await login('guest', 'guest')
}

export const checkLogin = async() => {
    try{
        const value = (await axios.get("/api/v1/users/?_self=true"))?.data
        if (value && value.length){
            return value[0] as User
        }
        return null
    }
    catch(e){
        throw {
            error:e,
            isOffline:e.code == "ERR_NETWORK" || e.message && (e.message as string).startsWith("Cannot read")
        }
    }
}

// export const getUserList = async (group:Group)=>{
//     return (await axios.get(`/api/v1/users/?groupId=${group.id}`) ).data.value as User[]
// }

// export const getGroup = async (user:User)=>{
//     return (await) axios.get(``)
// }

