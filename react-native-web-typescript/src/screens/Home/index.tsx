import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {ReactElement} from 'react';
import {Button, Text} from 'react-native';
import WebView from 'react-native-webview';
import {Container} from '../../components';
import {StackParams} from '../../navigation';

type NavigationProps = StackNavigationProp<StackParams, 'Home'>;

export function Home(): ReactElement {
  const {navigate} = useNavigation<NavigationProps>();
  return (
    <Container>
      <Text>Home Screen</Text>
      
      {/* <iframe src={'http://localhost:3000/live2d/'} allow='camera *;microphone *' height="100%" width="100%"/> */}
      <WebView
        source={{ uri: 'http://localhost:3000/live2d/' }}
        originWhitelist={['*']}
        allowsInlineMediaPlayback
        javaScriptEnabled
        scalesPageToFit
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabledAndroid
        useWebkit
        startInLoadingState={true}
      />
      <Button
        testID="details"
        title="Go to Details"
        onPress={() => navigate('Details', {data: '🤪'})}
      />
    </Container>
  );
}
