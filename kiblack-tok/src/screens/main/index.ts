import { PathConfig } from "@react-navigation/native";
import LoginScreen from "./LoginScreen";
import ChatScreen from "./ChatScreen";
import HomeScreen from "./HomeScreen";
import TabOneScreen from "./TabOneScreen";

export const main = {
    HomeScreen:{
        title:'home',
        component:HomeScreen,
        path:'home',
        options:{
            headerShown:false
        }
    },
    ChatScreen:{
        title:'chat',
        component:ChatScreen,
        path:'chat'
    },
    TabOneScreen:{
        title:'tab one',
        component:TabOneScreen,
        path:'one'
    },
} as Record<string, PathConfig & {title:string, component:React.ComponentType<any>, options?:any}>

export const login = {
    LoginScreen:{
        path: 'login',
        title: '로그인',
        component:LoginScreen
    },
} as typeof main