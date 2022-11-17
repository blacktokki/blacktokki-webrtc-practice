import React from "react";
import MemberTab from "./MemberTab";
import OneTab from "./OneTab";
import DrawerTab from './DrawerTab';
import ChatTab from "./ChatTab";

export const bottomTabs = {
    OneTab:{
        title:'member',
        component:MemberTab,
    },
    TwoTab:{
        title:'chat',
        component:ChatTab,
    },
    ThreeTab:{
        title:'channel',
        component:OneTab
    },FourTab:{
        title:'config',
        component:OneTab,
    }
} as Record<string, {title:string, component:React.ComponentType<any>}>

export const drawerTabs = {
    OneTab:{
        title:'member',
        component:DrawerTab.Member,
    },
    TwoTab:{
        title:'chat',
        component:DrawerTab.Chat,
    },
    ThreeTab:{
        title:'channel',
        component:DrawerTab.Channel
    }
} as Record<string, {title:string, component:React.ComponentType<any>}>