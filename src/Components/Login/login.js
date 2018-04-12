import React, {Component} from 'react';
import {
  View,
  Image,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  Text,
  AsyncStorage,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkStyleSheet,
  RkTheme
} from 'react-native-ui-kitten';

import {Actions} from 'react-native-router-flux'

import website_url from "../../../config"


import {FontAwesome} from '../../assets/icons';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';

const ACCESS_TOKEN = 'access_token'
const ACCOUNT = 'my_id'

export default class Login extends Component {
  constructor(props){
    super(props);
  
    this.state = {
       username: '',
       password: '',
       error: '',
       loading:false
    }
 }


 async storeToken(accessToken, account){
    try {
       await AsyncStorage.setItem(ACCESS_TOKEN, accessToken)
       await AsyncStorage.setItem(ACCOUNT, account)
    } catch (e) {
        console.log('something goes wrong at storeToken()!' + e)
    }
 }


 async login(){
  global.tracker.trackScreenView("Login")
   this.setState({loading:true})
    var url = website_url + 'api/v1/auth/login/'
    let data = {
       method: 'POST',
       body: JSON.stringify({
           'username': this.state.username,
           'password': this.state.password
       }),
       headers: {
          'Content-Type': 'application/json',
       }
    }

    try {
      response = await fetch(url, data)
      let res = await response.json()
      if(response.status >= 200 && response.status <= 300){
         this.setState({error: '', loading: false})
         this.storeToken(res.token, res.account.id.toString())
         Keyboard.dismiss()
         Actions.tabbar()

      }else{
         this.setState({loading: true})
         throw res
      }

   }catch (e) {
       this.setState({error: e, loading: false})
       alert('error: ' + e.message)
    }
}

  _renderImage(image) {
    let contentHeight = scaleModerate(375, 1);

    let height = Dimensions.get('window').height - contentHeight;
    let width = Dimensions.get('window').width;

    image = (<Image style={[styles.image, {height, width}]}
                      source={require('../../images/vecihi.jpg')}/>);

    return image;
  }

  render() {
    let image = this._renderImage();

    return (
      <RkAvoidKeyboard
        onStartShouldSetResponder={ (e) => true}
        onResponderRelease={ (e) => Keyboard.dismiss()}
        style={styles.screen}>
        {image}
        {this.state.loading
          ?
            <ActivityIndicator size="large" color="#0000ff" />
          :
            <ScrollView>
                          <View style={styles.container}>
            {/* <View style={styles.buttons}>
              <RkButton style={styles.button} rkType='social'>
                <RkText rkType='awesome hero accentColor'>{FontAwesome.twitter}</RkText>
              </RkButton>
              <RkButton style={styles.button} rkType='social'>
                <RkText rkType='awesome hero accentColor'>{FontAwesome.google}</RkText>
              </RkButton>
              <RkButton style={styles.button} rkType='social'>
                <RkText rkType='awesome hero accentColor'>{FontAwesome.facebook}</RkText>
              </RkButton>
            </View> */}
            <RkTextInput 
                onChangeText={(username) => this.setState({"username": username})}
                rkType='rounded' 
                placeholder='Email or Username' 
                underlineColorAndroid="transparent"
                autoCorrect={false}
                autoCapitalize="none"
                placeholderTextColor="white"
                blurOnSubmit={true}
                keyboardType="email-address"
                keyboardAppearance="default"/>
            <RkTextInput 
                onChangeText={(password) => this.setState({"password": password})}
                rkType='rounded' 
                placeholder='Password' 
                underlineColorAndroid="transparent"
                placeholderTextColor="white"
                autoCorrect={false}
                autoCapitalize="none"
                blurOnSubmit={true}
                keyboardAppearance="default"
                secureTextEntry={true}/>
            <TouchableOpacity onPress={this.login.bind(this) } style={styles.save}>
              <Text style={styles.loginText}>
                  Login in
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <View style={styles.textRow}>
                <RkText rkType='primary3'>Don’t have an account?</RkText>
                <RkButton rkType='clear'>
                  <RkText rkType='header6' onPress={() => Actions.signUp()}> Sign up
                    now </RkText>
                </RkButton>
              </View>
            </View>
          </View>
            </ScrollView>
          }
      </RkAvoidKeyboard>
    )
  }
}


let styles = RkStyleSheet.create(theme => ({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.screen.base
  },
  image: {
    resizeMode: 'cover',
    marginBottom: scaleVertical(10),
  },
  container: {
    paddingHorizontal: 17,
    paddingBottom: scaleVertical(22),
    alignItems: 'center',
    flex: -1
  },
  footer: {
    justifyContent: 'flex-end',
    flex: 1
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: scaleVertical(24)
  },
  button: {
    marginHorizontal: 14
  },
  save: {
    marginVertical: 9,
  },
  loginText:{
    textAlign: 'center',
    fontSize: 20,
    color: 'red'
  },

  textRow: {
    justifyContent: 'center',
    flexDirection: 'row',
  }
}));
