import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ScrollView,
} from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';
import firestore from '@react-native-firebase/firestore';
import {collectIdsAndDocs} from './src/shared/utilities';

const App = () => {
  const [stream, setStream] = useState(null);
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('streams')
      .onSnapshot(snapshot => {
        const result = snapshot.docs.map(doc => collectIdsAndDocs(doc));
        console.log('streams: ', result);
        // result.map(({stream}) => {
        //   console.log('ITEM', stream?.toURL());
        // });
        setStreams(result);
      });

    return () => subscriber();
  }, []);

  const startCall = () => {
    let isFront = true;
    mediaDevices.enumerateDevices().then(sourceInfos => {
      console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            width: 640,
            height: 480,
            frameRate: 30,
            facingMode: isFront ? 'user' : 'environment',
            deviceId: videoSourceId,
          },
        })
        .then(stream => {
          // Got stream!
          console.log('stream is: ', stream);
          setStream(stream);
          firestore()
            .collection('streams')
            .doc(stream.toURL())
            .set({stream: stream});
        })
        .catch(error => {
          // Log error
          console.log('ERROR', error);
        });
    });
  };

  const endCall = () => {};

  return (
    <ScrollView>
      <View>
        {stream && (
          <RTCView
            streamURL={stream.toURL()}
            style={{height: 400, width: '100%'}}
          />
        )}
      </View>
      <Button title="Start Call" onPress={startCall} />
      <Button title="End Call" onPress={() => setStream(null)} />

      {/* <View>
        {streams.length > 0 &&
          streams.map(item => (
            <RTCView
              key={item.id}
              streamURL={item.stream.toURL()}
              style={{height: 400, width: '100%'}}
            />
          ))}
      </View> */}
    </ScrollView>
  );
};

export default App;

const styles = StyleSheet.create({});
