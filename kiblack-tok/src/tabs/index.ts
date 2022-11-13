import React from "react";
import MemberTab from "./MemberTab";
import OneTab from "./OneTab";

export const bottomTabs = {
    OneTab:{
        title:'member',
        component:MemberTab,
    },
    TwoTab:{
        title:'room',
        component:OneTab,
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
        component:OneTab,
    },
    TwoTab:{
        title:'room',
        component:OneTab,
    },
    ThreeTab:{
        title:'channel',
        component:OneTab
    }
} as Record<string, {title:string, component:React.ComponentType<any>}>