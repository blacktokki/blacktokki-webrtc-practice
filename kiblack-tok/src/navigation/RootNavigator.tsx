import { createStackNavigator } from '@react-navigation/stack';
import React, {useMemo} from 'react';
import { View } from 'react-native';

import useResizeWindow from '../hooks/useResizeWindow';
import NotFoundScreen from '../screens/NotFoundScreen';
import {main, login} from '../screens/main';
import DrawerNavigator from './DrawerNavigator';
import useLoginContext, {LoginProvider} from '../hooks/useLoginContext';

const Root = createStackNavigator();

export default function RootNavigator() {
    return (
            <LoginProvider>
                <Root.Navigator
                    mode= 'modal'
                    headerMode= 'none'
                    screenOptions={{
                        cardStyle:{
                            backgroundColor:"transparent",
                            opacity:0.99
                        }
                    }}
                >
                    <Root.Screen name="Main" component={MainNavigator}/>
                    {/* <Root.Screen name="Modal" component={}/> */}
                </Root.Navigator>
            </LoginProvider>
    );
}

const Main = createStackNavigator();

function MainNavigator(){
    const windowType = useResizeWindow();
    const {user} = useLoginContext()
    const entries = useMemo(()=>{
        if (user === undefined)
            return []
        return Object.entries(user === null?login:main)
    }, [user])
    return (user!==undefined?<View style={{flexDirection:'row', flex:1}}>
        {user && windowType=='landscape'?<DrawerNavigator/>:undefined}
        <View style={{flex:1, flexDirection:'column-reverse'}}>
            <Main.Navigator>
                {entries.map(([key, screen])=><Main.Screen key={key} name={key} component={screen.component} options={{ title: screen.title, ...screen.options }} />)}
                <Main.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
            </Main.Navigator>
        </View>
    </View>:<></>);
}