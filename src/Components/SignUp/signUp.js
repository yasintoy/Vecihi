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
  ScrollView,
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkStyleSheet,
  RkTheme,
  RkPicker
} from 'react-native-ui-kitten';

import {Actions} from 'react-native-router-flux';
import ModalDropdown from 'react-native-modal-dropdown';

import {FontAwesome} from '../../assets/icons';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';
import MAJORS from '../../utils/majors'

import website_url from "../../../config"

const ACCESS_TOKEN = 'access_token'
const ACCOUNT = 'my_id'

var {height, width} = Dimensions.get('window');

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email:'',
      username: '',
      major: 'Department',
      password: '',
      confirmPassword: '',
      error: '',
      loading: false,
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

 async getToken(){
    try {
       let token = await AsyncStorage.getItem(ACCESS_TOKEN)
    } catch (e) {
       console.log('Something goes wrong!' + e);
    }
 }

 async removeToken(){
    try {
       let token = await AsyncStorage.removeItem(ACCESS_TOKEN)
    } catch (e) {
       console.log('Something goes wrong!');
    }
 }

  async signUp(){
    global.tracker.trackScreenView("SignUp")
    this.setState({loading: true})
    var url = website_url + 'api/v1/accounts/register/';
    try{
      if(this.state.password == this.state.confirmPassword){
          let data = {
            method: 'POST',
            body: JSON.stringify({
                "email": this.state.email,
                "username": this.state.username,
                "major": this.state.major,
                "password": this.state.password,
                "confirm_password": this.state.confirmPassword
            }),
            headers: {
                "Content-Type": "application/json",
            }
          }
          
          response = await fetch(url, data)
          let res = await response.json()
          if(response.status >= 200 && response.status <= 300){
             this.setState({error: '', loading: false})
             this.storeToken(res.token, res.account.id.toString())
             Keyboard.dismiss()
             Actions.tabbar()
          }else{
            this.setState({loading: false})
            let error = res
            throw error
          }

      }else{
          this.setState({loading: false})
          alert("Password doesn't match :( ");
      }
    }catch(e){
        this.setState({error: e, loading: false})
        alert("Error : " + e.message);
    }
  }

  _renderImage(image) {
    let contentHeight = scaleModerate(400, 1);

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
            <ActivityIndicator size='large' color='#0000ff' />
          :
              <ScrollView>
                          <View style={styles.container}>
          
                    <RkTextInput 
                        onChangeText={(email) => this.setState({email: email})}
                        rkType='rounded' 
                        placeholder='Email'
                        underlineColorAndroid="transparent"
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholderTextColor="white"
                        blurOnSubmit={true}
                        keyboardType="email-address"
                        keyboardAppearance="default"/>
                    <RkTextInput 
                        onChangeText={(username) => this.setState({username: username})}
                        rkType='rounded' 
                        placeholder='Username'
                        underlineColorAndroid="transparent"
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholderTextColor="white"
                        blurOnSubmit={true}
                        keyboardAppearance="default"/>
    


                        <ModalDropdown style={styles.major} onSelect={(index, value) => this.setState({major: value})} options={MAJORS}>
                            <View style={{flex:1, justifyContent:'center', width:width-50, height: 50}}> 
                                <Text style={{color:'gray'}}> {this.state.major} </Text>
                            </View>
                        </ModalDropdown>


                    <RkTextInput 
                        onChangeText={(password) => this.setState({password: password})}
                        rkType='rounded' 
                        placeholder='Password' 
                        secureTextEntry={true}
                        underlineColorAndroid="transparent"
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholderTextColor="white"
                        blurOnSubmit={true}
                        keyboardAppearance="default"/>
                    <RkTextInput 
                        onChangeText={(confirm_password) => this.setState({confirmPassword: confirm_password})}
                        rkType='rounded' 
                        placeholder='Confirm Password' 
                        secureTextEntry={true}
                        underlineColorAndroid="transparent"
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholderTextColor="white"
                        blurOnSubmit={true}
                        keyboardAppearance="default"/>
                    <TouchableOpacity onPress={this.signUp.bind(this) } style={styles.save}>
                      <Text style={styles.loginText}>
                          sign up
                      </Text>
                    </TouchableOpacity>
          
                    <View style={styles.footer}>
                      <View style={styles.textRow}>
                        <RkText rkType='primary3'>Do have already an account?</RkText>
                        <RkButton rkType='clear'>
                          <RkText rkType='header6' onPress={() => Actions.login()}> Login
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
  },
  major: {
    flex:1, 
    flexDirection:'row',
    alignItems:'center',
    height: 50, 
    width:width-40, 
    backgroundColor: 'transparent', 
    color: 'gray', 
    borderWidth:0.3, 
    borderBottomColor:'gray', 
    paddingHorizontal: 10, 
    borderRadius:25
  }
}));
