import React from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions
} from 'react-native';

import Camera from 'react-native-camera';
import Iconz from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';
import PhotoUpload from 'react-native-photo-upload'

const { height, width } = Dimensions.get("window")


var xhr = new XMLHttpRequest();

export default class CameraApp extends React.Component {
  constructor(props) {
    super(props);

    this.camera = null;

    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        type: Camera.constants.Type.front,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.off,
        captureQuality: Camera.constants.CaptureQuality.medium,
        captureTarget: Camera.constants.CaptureTarget.disk, 
        cameraEnabled: false
      },
      isRecording: false,
      path: null
    };
  }

  componentDidMount() {
    global.tracker.trackScreenView("Camera")
    requestAnimationFrame(() => {
        // update the camera state here or send a value to a function that changes the cameraEnabled state
        this.setState({
            cameraEnabled: true
        })  
    })
   
  }

  takePicture = () => {
    if (this.camera) {
      this.camera.capture().then((data)=> {
         this.setState({path: data.path});
         Actions.preview({'path': data.path});
       }
      )
      .catch(err => console.error(err));
    }
  }

  startRecording = () => {
    if (this.camera) {
      this.camera.capture({mode: Camera.constants.CaptureMode.video, audio:true, target: Camera.constants.CaptureTarget.cameraRoll})
          .then((data) =>
             //this.props.navigator.push({'id': 'profile', passProps:{image: data.path}})
             this.setState({path: data.path})
          )
          .catch(err => console.error(err));
      this.setState({
        isRecording: true
      });
    }
  }

  stopRecording = () => {
    if (this.camera) {
      this.camera.stopCapture();
      this.setState({
        isRecording: false
      });
      Actions.preview({'path': this.state.path});
    }
  }

  switchType = () => {
    let newType;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      newType = front;
    } else if (this.state.camera.type === front) {
      newType = back;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType,
      },
    });
  }

  get typeIcon() {
    let icon;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      icon = require('./assets/ic_camera_rear_white.png');
    } else if (this.state.camera.type === front) {
      icon = require('./assets/ic_camera_front_white.png');
    }

    return icon;
  }

  switchFlash = () => {
    let newFlashMode;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = auto;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
    });
  }

  get flashIcon() {
    let icon;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      icon = require('./assets/ic_flash_auto_white.png');
    } else if (this.state.camera.flashMode === on) {
      icon = require('./assets/ic_flash_on_white.png');
    } else if (this.state.camera.flashMode === off) {
      icon = require('./assets/ic_flash_off_white.png');
    }

    return icon;
  }

  closeCamera(){
    this.setState({
        cameraEnabled: false
    })
    Actions.tabbar()
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          animated
          hidden
        />
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={this.state.camera.aspect}
          captureTarget={this.state.camera.captureTarget}
          captureQuality={this.state.camera.captureQuality}
          type={this.state.camera.type}
          flashMode={this.state.camera.flashMode}
          defaultTouchToFocus
          mirrorImage={false}
        />
        <View style={[styles.overlay, styles.topOverlay]}>
        <TouchableOpacity
          style={styles.typeButton}
          onPress={() => this.closeCamera()}
        >
           <Iconz name = "ios-arrow-dropleft" color="#fff" size={30} style={{margin:5, backgroundColor: 'transparent'}} />
        </TouchableOpacity>

          <TouchableOpacity
            style={styles.typeButton}
            onPress={this.switchType}
          >

            <Iconz name = "ios-reverse-camera-outline" color="#fff" size={30} style={{margin:5}} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flashButton}
            onPress={this.switchFlash}
          >
            <Image
              source={this.flashIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.overlay, styles.bottomOverlay]}>
        <PhotoUpload
                style={styles.galery}
                onResponse={(response)=> {
                    let url = response.uri.split("//")[1]
                    this.setState({path: url});
                    Actions.preview({'path': url});
                }}>
                  <Image source={require('./assets/galery.png')} style={{height:55, width:55}}/>
              </PhotoUpload>

          <TouchableOpacity
                style={styles.captureButton}
                onPress={this.takePicture}
            >
            <Image
              source={this.flashIcon}
            />
            </TouchableOpacity>

          <PhotoUpload
                style={styles.galery}
                onResponse={(response)=> {
                    let url = response.uri.split("//")[1]
                    this.setState({path: url});
                    Actions.preview({'path': url});
                }}>
                  <Image source={require('./assets/galery.png')} style={{height:55, width:55}}/>
              </PhotoUpload>


          <View style={styles.buttonsSpace}/>

        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomOverlay: {
    bottom: 0,
    opacity: 0.7,
    flex:1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  captureButton: {
    padding: 15,
    height:55,
    width:55,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  typeButton: {
    padding: 5,
    backgroundColor: 'transparent'
  },
  flashButton: {
    padding: 5,
  }
});
