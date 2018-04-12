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

import PhotoUpload from 'react-native-photo-upload'
import {Actions} from 'react-native-router-flux';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Iconz from 'react-native-vector-icons/Ionicons';

import {FontAwesome} from '../../assets/icons';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';
import MAJORS from '../../utils/majors'

import website_url from "../../../config"

const ACCESS_TOKEN = 'access_token'
const ACCOUNT = 'my_id'

var {height, width} = Dimensions.get('window');

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: this.props.info.firstName,
      lastName: this.props.info.lastName,
      bio: this.props.info.bio,
      image: this.props.info.image,
      user_id: this.props.info.id,
      token: this.props.token,
      error: '',
      loading: false,

   }

  }


  async updateProfile(){
    var url = website_url + 'api/v1/accounts/' + this.state.user_id + '/update_user/';
    const file = {
        uri: this.state.image,
        name : Math.random().toString(36).substring(2) + '.jpg',
        type: 'image/jpg'
    }

    const data = new FormData()
    if(this.props.info.image != this.state.image){
      data.append('image', file)
    }
    data.append('bio', this.state.bio)
    data.append('first_name', this.state.firstName)
    data.append('last_name', this.state.lastName)
    this.setState({
      loading:true
    })
    await fetch(url, {
        method: 'PUT',
        body: data,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d',
          'Authorization': 'Token ' + this.state.token,
        },
  }).then(res => {
    this.setState({
      loading:false
    })
    Actions.profile()
  });


  }

  nav(){
    return(<View style={{height:60, flexDirection:'row', paddingLeft:10, paddingRight:10, paddingTop:10, alignItems:'center', justifyContent:'space-between', borderBottomWidth:1, borderBottomColor:'#e7e7e7'}}>
      <TouchableOpacity onPress={() => Actions.profile()}>
         <Text style={{fontWeight:'600', fontSize:16, paddingRight: 15}}>Back</Text>
      </TouchableOpacity>
      
      <Text style={{fontWeight:'600', fontSize:16}}>Edit Profile</Text>
      </View>)
  }


  render() {
    return (
      <RkAvoidKeyboard
        onStartShouldSetResponder={ (e) => true}
        onResponderRelease={ (e) => Keyboard.dismiss()}
        style={styles.screen}>
        {this.state.loading 
          ?
            <ActivityIndicator size='large' color='#0000ff' />
          :
              <ScrollView>
                          <View style={styles.container}>
                        {this.nav()}
                        <PhotoUpload
                          onResponse={(response)=> {
                              let url = response.uri.split("//")[1]
                              this.setState({image: url})
                          }}>
                          <Image
                            style={styles.image}
                            source={{
                              uri: this.state.image
                            }}
                          />
                        </PhotoUpload>

                    <RkTextInput 
                        onChangeText={(firstName) => this.setState({firstName: firstName})}
                        rkType='form' 
                        defaultValue={this.state.firstName}
                        placeholder='First Name'
                        underlineColorAndroid="transparent"
                        autoCorrect={false}
                        autoCapitalize="words"
                        placeholderTextColor="white"
                        blurOnSubmit={true}
                        keyboardAppearance="default"/>
                    <RkTextInput 
                        onChangeText={(lastName) => this.setState({lastName: lastName})}
                        rkType='form' 
                        placeholder='Last Name'
                        defaultValue={this.state.lastName}
                        underlineColorAndroid="transparent"
                        autoCorrect={false}
                        autoCapitalize="words"
                        placeholderTextColor="white"
                        blurOnSubmit={true}
                        keyboardAppearance="default"/>

                    <RkTextInput 
                        onChangeText={(bio) => this.setState({bio: bio})}
                        rkType='form' 
                        placeholder='Bio' 
                        defaultValue={this.state.bio}
                        underlineColorAndroid="transparent"
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholderTextColor="white"
                        blurOnSubmit={true}
                        multiline={true}
                        keyboardAppearance="default"/>
                    <TouchableOpacity onPress={this.updateProfile.bind(this) } style={styles.save}>
                      <Text style={styles.loginText}>
                          Update
                      </Text>
                    </TouchableOpacity>
          

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.screen.base
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
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
  image: {
    resizeMode: 'cover',
    marginBottom: scaleVertical(10),
    height: 150,
    width: 150,
    borderRadius: 75
  },
}));
