import { PathConfig } from "@react-navigation/native";
import MemberScreen from "./MemberScreen";
import TabOneScreen from "./TabOneScreen";

export default {
    MemberScreen:{
        screens:{
            defaultStack:{
                title:'member',
                component:MemberScreen,
            }
        },
        path:'member'
    },
    TabOneScreen:{
        screens:{
            defaultStack:{
                title:'tab one',
                component:TabOneScreen,
            }
        },
        path:'one'
    },
    TabTwoScreen:{
        screens:{
            defaultStack:{
                title:'tab two',
                component:TabOneScreen,
            }
        },
        path:'two'
    },
} as Record<string, {screens:Record<string, PathConfig & {title:string, component:React.ComponentType<any>}>}>
