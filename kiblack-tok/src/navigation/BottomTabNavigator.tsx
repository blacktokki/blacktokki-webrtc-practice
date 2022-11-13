
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { PathConfigMap } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import useResizeWindow from '../hooks/useResizeWindow';
import bottomTab from '../screens/bottom-tab';
import ResponsiveNavigator, { DrawerNavigator } from './ResponsiveNavigator';

const BottomTab = createBottomTabNavigator();


export const bottomTabPathConfig = {
    screens:bottomTab
} as PathConfigMap

export default function BottomTabNavigator() {
    const colorScheme = useColorScheme();
    const windowType = useResizeWindow();
    return (
        <View style={{flexDirection:'row', flex:1}}>
            {windowType=='landscape'?<ResponsiveNavigator ResponsiveNavigator={DrawerNavigator}/>:undefined}
            <View style={{flex:1, flexDirection:'column-reverse'}}>
                <BottomTab.Navigator
                    // initialRouteName=""
                    screenOptions={{unmountOnBlur:true}}
                    tabBarOptions={{activeTintColor: Colors[colorScheme].tint}}
                    tabBar={windowType=='landscape'?(()=><></>):undefined}
                >
                    {Object.entries(bottomTab).map((([key, screen])=>{
                        return <BottomTab.Screen
                            key={key}
                            name={key}
                            component={screen.component}
                            options={{
                                tabBarLabel:screen.title,
                                tabBarIcon:(props)=><TabBarIcon name="code" color={props.color}/>,
                            }}
                        />
                    }))}
                </BottomTab.Navigator>
            </View>
        </View>
    );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}