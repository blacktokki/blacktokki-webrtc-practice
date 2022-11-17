import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TabView, SceneMap,NavigationState, SceneRendererProps, TabBar } from 'react-native-tab-view';
import { logout } from '../apis';
import CommonButton from '../components/CommonButton';
import DummyView from '../components/DummyView';
import useLoginContext from '../hooks/useLoginContext';
import { drawerTabs } from '../tabs';

export const TabViewNavigator = (props:{tabs:typeof drawerTabs, tabBarPosition:"top"|"bottom", index?:number, onTab?:(index:number)=>void})=>{
  const [index, setIndex] = React.useState(props.index || 0);
  const entries = Object.entries(props.tabs)
  const onTab = props.onTab
  const icons = Object.assign({}, ...entries.map(([k, v])=>({[k]:<FontAwesome size={30} style={{ marginBottom: -3 }} name='code'/>})))
  return <TabView
    renderTabBar={(props:SceneRendererProps & {navigationState: NavigationState<any>})=>{
      return <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: "#2196F3" }}
        style={{ backgroundColor:'white' }}
        activeColor={'black'}
        inactiveColor={'black'}
        renderIcon={(scene)=>icons[scene.route.key]}
        onTabPress={(scene)=>onTab?.(entries.findIndex(([k, v])=>k == scene.route.key))}
      />
    }}
    navigationState={{ index, routes: entries.map(([k, v])=>({key:k, title:v.title}))}}
    onIndexChange={setIndex}
    renderScene={SceneMap(Object.assign({}, ...entries.map(([k, v])=>({[k]:v.component}))))}
    tabBarPosition={props.tabBarPosition}
  />
}

export default ()=> {
  const { colors } = useTheme();
  const {setUser} = useLoginContext()
  return <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        // tabBarStyle,
      ]}
      pointerEvents={false ? 'none' : 'auto'}
    >
      <DummyView style={{width:'100%', height:135}} text='profile'/>
      <CommonButton title={'logout'} onPress={()=>logout().then(()=>setUser(null))}/>
      <View accessibilityRole="tablist" style={styles.content}>
        <TabViewNavigator tabs={drawerTabs} tabBarPosition={"top"}/>
      </View>
    </View>
}

{/*<Text style={[styles.label, { color: d.isFocused ? colors.primary : '#222' }]}></Text> */}

const styles = StyleSheet.create({
    tabBar: {
      width:240,
      elevation: 8,
    },
    content: {
      flex: 1,
      flexDirection: 'row',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
    },
    label: {
        textAlign: 'center',
        backgroundColor: 'transparent',
      },
  });