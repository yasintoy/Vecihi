import React, {Component} from 'react';
import {
   View,
   Text,
   Image,
   TouchableOpacity,
   AppRegistry,
   StyleSheet,
   Dimensions,
   AsyncStorage,
   ActivityIndicator,
   TextInput,
   Keyboard,
   KeyboardAvoidingView
} from 'react-native';

import Iconz from 'react-native-vector-icons/Ionicons';

const {height, width} = Dimensions.get('window')

import website_url from "../../../config"
import { Actions } from 'react-native-router-flux';

ACCESS_TOKEN = 'access_token'

export default class Edit extends Component{
  constructor(props){
     super(props);
     this.state = {
        image : this.props.image,
        token: '',
        loading: false,
        description: ''
     }
  }

  componentWillMount(){
     this.getToken()
     global.tracker.trackScreenView("Edit")
  }

  async getToken(){
     try {
        let token = await AsyncStorage.getItem(ACCESS_TOKEN)
        this.setState({
            token: token
        })
     } catch (e) {
        console.log('Something goes wrong!' + e);
     }
  }

    async upload(url){
      var send_url = website_url + 'api/v1/posts/'
       const file = {
           uri: url,
           name : Math.random().toString(36).substring(2) + '.jpg',
           type: 'image/jpg'
       }

       const data = new FormData()
       data.append('image', file)
       data.append('description', this.state.description)
       this.setState({
          loading:true
       })
       await fetch(send_url, {
        method: 'POST',
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
       Actions.tabbar()
      });
    }

    render(){
      if(this.state.loading){
        return(
          <View style={styles.loading}>
            <ActivityIndicator size='large' />
          </View>
        )
      }else{
        return(
          <KeyboardAvoidingView style={styles.container} behavior="padding">

              <Image source={{uri: this.state.image}} style={styles.preview} resizeMode="cover" />
                <View style={styles.nav}>
                    <TouchableOpacity style={styles.cancel} onPress={() => Actions.pop()
                    }>
                          <Iconz name = "ios-close-circle-outline" color="#fff" size={30} style={{margin:5, backgroundColor:'transparent'}} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.other} onPress={() => {} }>
                          <Text></Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.share} onPress={() => this.upload(this.state.image)}>
                          <Iconz name = "ios-paper-plane-outline" color="#fff" size={30} style={{margin:5, backgroundColor:'transparent'}} />
                    </TouchableOpacity>
                </View>
              
            <View style={styles.form}>
                    <TextInput
                        onChangeText={(text) => this.setState({description: text})}
                        underlineColorAndroid="transparent"
                        multiline={true}
                        placeholder="description"
                        style={styles.input}
                        placeholderTextColor="gray"
                        autoCorrect={false}
                        autoCapitalize="none"
                        blurOnSubmit={true}
                        keyboardAppearance="default"/>

                </View>  

          </KeyboardAvoidingView>
        );
      }

    }
}


const styles = StyleSheet.create({
   container : {
     flex: 1,
   },
   preview: {
     flex:3,
     height: Dimensions.get('window').height,
     width: Dimensions.get('window').width,
   },
   loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
   nav:{
     position: 'absolute',
     top: 0,
     height:50,
     width: Dimensions.get('window').width,
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     left:20
   },
   cancel:{
     flex:1,
     paddingRight:20
   },

   share:{
     flex:1,

   },
   other:{
     flex:1,
     backgroundColor:'transparent'
   },
   form: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: 'white'
   },
   input:{
     flex:1,
     width: width,
     borderWidth: 1,
     textAlign: 'auto',
     fontSize: 15,
     color: 'gray',
     borderColor :'gray'
   }


})
