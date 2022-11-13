import { PathConfig } from "@react-navigation/native";
import MemberScreen from "./MemberScreen";
import TabOneScreen from "./TabOneScreen";

export default {
    MemberScreen:{
        title:'member',
        component:MemberScreen,
        path:'member'
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
} as Record<string, PathConfig & {title:string, component:React.ComponentType<any>}>
