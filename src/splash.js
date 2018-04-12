
import React, {Component} from 'react';
import {
   View,
   Text,
   AppRegistry,
   StyleSheet,
   Image,
   AsyncStorage,
   Dimensions,
   AppState, 
   Alert 
} from 'react-native';

import {Actions} from 'react-native-router-flux';

const {height, width} = Dimensions.get("window")
const ACCESS_TOKEN = 'access_token';

export default class Splash extends Component{
  constructor(props){
     super(props);
  }

  componentWillMount(){
    global.tracker.trackScreenView("Splash")
    AsyncStorage.getItem(ACCESS_TOKEN).then((TOKEN) => {
      if(TOKEN){
          setTimeout(() => Actions.tabbar(), 2000)
      }else {
        setTimeout(() => Actions.signUp(), 2000)
      }
    })

}

    render(){
      return(
        <View style={styles.container}>
           <View style={styles.imageBox}>
              <Image source={require('./images/vecihi.jpg')} style={{width:width, height:height}} resizeMode="cover"/>
           </View>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
imageBox:{
   flex:1,
   justifyContent: 'center',
   alignItems: 'center',
}

})
