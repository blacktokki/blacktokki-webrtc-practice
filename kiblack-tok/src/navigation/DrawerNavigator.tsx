
import { FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer';
import { PathConfig, PathConfigMap, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import useResizeWindow from '../hooks/useResizeWindow';
import drawer from '../screens/drawer';
import ResponsiveNavigator, { tabBarHeight, TabBarNavigation } from './ResponsiveNavigator';
import SectionDrawerContent from './DrawerContent';

const drawerWidth = 240;
const Drawer = createDrawerNavigator();


export const drawerPathConfig = {
    screens:drawer
} as PathConfigMap

export default function DrawerNavigator() {
    const colorScheme = useColorScheme();
    const windowType = useResizeWindow();
    const footer = React.useMemo(()=><ResponsiveNavigator ResponsiveNavigator={TabBarNavigation}/>, [])
    const stacks = React.useMemo(()=>stackNavigatorComponents(footer),[footer])
    return (
        <>
            <Drawer.Navigator
                // initialRouteName=""
                screenOptions={{unmountOnBlur:true}}
                drawerContent={SectionDrawerContent}
                drawerContentOptions={{activeTintColor: Colors[colorScheme].tint}}
                drawerType={'permanent'}
                drawerStyle={{maxWidth:windowType=='portrait'?0:drawerWidth}}
            >
                {Object.entries(drawer).map((([key, screen])=>{
                    return <Drawer.Screen
                        key={key}
                        name={key}
                        component={stacks[key]}
                        options={{
                            drawerLabel: (props)=><View style={{left:16}}>
                            <TabBarIcon name="code" color={props.color}/>
                            <Text style={{textAlign: 'center'}}>{screen.screens.defaultStack.title}</Text>
                            </View>,
                            // drawerIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
                        }}
                    />
                }))}
            </Drawer.Navigator>
        </>
    );
}


function stackNavigatorComponents(footer:JSX.Element){
    return Object.entries(drawer).reduce((record, [key, screen])=>{
        const TabStack = createStackNavigator();
        function TabNavigator({}: DrawerScreenProps<any, any>) {
            const windowType = useResizeWindow()
            return (
              <View style={{flex:1}}>
                <ScrollView contentContainerStyle={{flex:1}}>
                <TabStack.Navigator>
                    {Object.entries(screen.screens).map(([key2, stack], index)=>{
                    return <TabStack.Screen
                        key={key2}
                        name={key2}
                        component={stack.component || stack}
                        options={(option)=>({
                            headerTitle: stack.title,
                            cardStyle: {overflow:'visible'},
                        })}
                        />
                    })}
                    </TabStack.Navigator>
                    </ScrollView>
                    {windowType=='portrait'?footer:undefined}
                </View>
          );}
        record[key] = TabNavigator
        return record
    }, {} as Record<string, React.ComponentType<any>>)
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