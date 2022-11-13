import { PathConfigMap } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { View } from 'react-native';

import useResizeWindow from '../hooks/useResizeWindow';
import NotFoundScreen from '../screens/NotFoundScreen';
import root from '../screens/root';
import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator();

export default function BottomTabNavigator() {
    const windowType = useResizeWindow();
    return (
        <View style={{flexDirection:'row', flex:1}}>
            {windowType=='landscape'?<DrawerNavigator/>:undefined}
            <View style={{flex:1, flexDirection:'column-reverse'}}>
                <Stack.Navigator
                    // initialRouteName=""
                >
                    {Object.entries(root).map(([key, screen])=><Stack.Screen key={key} name={key} component={screen.component} options={{ title: screen.title, ...screen.options }} />)}
                    <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
                </Stack.Navigator>
            </View>
        </View>
    );
}
