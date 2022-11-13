import { PathConfig } from "@react-navigation/native";
import HomeScreen from "./HomeScreen";
import TabOneScreen from "./TabOneScreen";

export default {
    HomeScreen:{
        title:'home',
        component:HomeScreen,
        path:'home',
        options:{
            headerShown:false
        }
    },
    TabOneScreen:{
        title:'tab one',
        component:TabOneScreen,
        path:'one'
    },
    TabTwoScreen:{
        title:'tab two',
        component:TabOneScreen,
        path:'two'
    },
} as Record<string, PathConfig & {title:string, component:React.ComponentType<any>, options?:any}>
