import { StackNavigationOptions } from "@react-navigation/stack"
import { ComponentType } from "react"

const Constants:{
    initialRouteName?:string,
    notFoundScreen:{
        component: ComponentType<any>,
        title: string,
    },
    rootPath: string,  //github repository name,
    screenOptions: StackNavigationOptions
} = {
    initialRouteName:undefined,
    notFoundScreen: require('../screens').default.screens.NotFoundScreen,
    rootPath: '/react-native-practice',
    screenOptions:{}
}
export default Constants