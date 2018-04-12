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
   ActivityIndicator
} from 'react-native';

import Iconz from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';


export default class Preview extends Component{
  constructor(props){
     super(props);
     this.state = {
        image : this.props.path,
        token: '',
        loading: false
     }
  }

  componentWillMount(){
    this.getToken()
    global.tracker.trackScreenView("Preview")
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


    render(){
      return(
          <View style={styles.container}>
                <Image source={{uri: this.state.image}} style={styles.preview} resizeMode="cover" />
                  <View style={styles.nav}>
                      <TouchableOpacity style={styles.cancel} onPress={() => Actions.pop()}>
                            <Iconz name = "ios-close-circle-outline" color="#fff" size={30} style={{margin:5, backgroundColor:'transparent'}} />
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.other} onPress={() => Actions.pop()}>
                            <Text></Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.share} onPress={() => Actions.edit({'image': this.state.image})}>
                            <Iconz name = "ios-arrow-dropright" color="#fff" size={30} style={{margin:5, backgroundColor:'transparent'}} />
                      </TouchableOpacity>
                  </View>

          </View>
      );
    }
}


const styles = StyleSheet.create({
   container : {
     flex: 1,
   },
   preview: {
     flex:1,
     height: Dimensions.get('window').height,
     width: Dimensions.get('window').width,
     position: 'absolute'
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
     left:25
   },
   other:{
     flex:1,
     backgroundColor:'transparent'
   }


})
