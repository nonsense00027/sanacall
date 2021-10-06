import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CreateScreen from './src/screens/CreateScreen';
import CallScreen from './src/screens/CallScreen';
import JoinScreen from './src/screens/JoinScreen';

const App = () => {
  const [screen, setScreen] = useState('');
  const [roomId, setRoomId] = useState('');

  const getScreen = () => {
    switch (screen) {
      case 'JOIN':
        return <JoinScreen setScreen={setScreen} roomId={roomId} />;
      case 'CALL':
        return <CallScreen setScreen={setScreen} roomId={roomId} />;
      default:
        return (
          <CreateScreen
            setScreen={setScreen}
            setRoomId={setRoomId}
            roomId={roomId}
          />
        );
    }
  };
  return <View style={{flex: 1}}>{getScreen()}</View>;
};

export default App;

const styles = StyleSheet.create({});
