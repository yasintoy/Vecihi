/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Image,
  ListView,
  Dimensions,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';

import moment from 'moment'
import {Actions} from 'react-native-router-flux'

import Icon from 'react-native-vector-icons/Ionicons';
import Iconz from 'react-native-vector-icons/MaterialIcons';

import {Rating} from 'react-native-elements'

var p = -1;

var {height, width} = Dimensions.get('window');
var imageSize = (width/3) - 1

const ACCESS_TOKEN = 'access_token'
const ACCOUNT = 'my_id'

import website_url from "../../../config"
const WATER_IMAGE = require('../../images/water.png')


var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Profile extends Component {
  constructor(props){
    super(props)

    this.state = {
      images: ds.cloneWithRows([]),
      info: {},
      token: '',
      id: 'my_id',
      loading: false
    }
  }

  async signOut(){
    try {
       await AsyncStorage.removeItem(ACCESS_TOKEN)
       Actions.splash()
    } catch (e) {
        //console.log('Something goes Wrong!' + e)
    }
  }

  async getImages(){
    this.setState({loading: true})
    let user_id = await AsyncStorage.getItem(ACCOUNT)
    let url = website_url + "api/v1/user/"+ user_id + "/posts/"
    let data = {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json',
         'Authorization': 'Token ' + this.state.token
      }
   }

     fetch(url, data)
        .then(response => response.json())
        .then(jsonData => {
           this.setState({
              images: this.state.images.cloneWithRows(jsonData.results),
              loading: false
           })
        })
        .catch(error =>{
            this.setState({loading: false})
        })

  }

  async getInfo(){
      var url = website_url + 'api/v1/accounts/me/'

       let token = await AsyncStorage.getItem(ACCESS_TOKEN)
       let id = await AsyncStorage.getItem(ACCOUNT)
       this.setState({
           token: token,
           id: id
       })

       let data = {
          method: 'GET',
          headers: {
             'Content-Type': 'application/json',
             'Authorization': 'Token ' + token
          }
       }

       try {
         response = await fetch(url, data)
         let res = await response.json()
         if(response.status >= 200 && response.status <= 300){
            this.setState({
                error: '',
                info: res
            })

         }else{
            let error = res
            throw error
         }

      }catch (e) {
          this.setState({error: e})
          //console.log('error: ' + e)
       }

  }


  componentWillMount(){
    global.tracker.trackScreenView("Profile")
    this.getInfo().then(() => {
        this.getImages()
    })

  }


  metrics(){
    return(<View style={{flex:2, margin:15, marginBottom:5, flexDirection:'row', justifyContent:'space-around'}}>
      <View style={{alignItems:"center", margin:15, justifyContent:'center'}}>
        <Text style={{fontWeight:'400', fontSize:18}}>{this.state.info.totalPosts}</Text>
        <Text style={{color:"#888", fontSize:13}}>posts</Text>
      </View>
      <TouchableHighlight onPress={() => Actions.followers({'user_id': this.state.id})}>
        <View style={{alignItems:"center", margin:15, justifyContent:'center'}}>
          <Text style={{fontWeight:'400', fontSize:18}}>{this.state.info.followers}</Text>
          <Text style={{color:"#888", fontSize:13}}>followers</Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => Actions.following({'user_id': this.state.id})}>
        <View style={{alignItems:"center", margin:15, justifyContent:'center'}}>
          <Text style={{fontWeight:'400', fontSize:18}}>{this.state.info.following}</Text>
          <Text style={{color:"#888", fontSize:13}}>following</Text>
        </View>
      </TouchableHighlight>

      </View>)
  }
  info(){
    return(<View style={{flex:2, padding:10, paddingTop:10}}>
      <View style={{flex:3, alignItems:'center', justifyContent:'center'}}>
        <Image source ={{uri : this.state.info.image}} resizeMode = "cover" style={{width:80, height:80, borderRadius:40}} />

        <View style={{flex:2, justifyContent:'center', alignItems:'center', paddingTop:10}}>
          <Text style={{fontWeight:'300', fontSize:12,  paddingBottom: 10}}>{this.state.info.bio}</Text>
          <Text style={{fontWeight:'400', fontSize:14, color:'#2f89bd'}}>{this.state.info.major}</Text>
        </View>

          <View style={{flex:3}}>
              {this.metrics()}
            <View style={{flex:2, alignItems:'center'}}>
              <TouchableHighlight onPress={() => this.signOut()} style={{width:240, height:30, margin:5, borderColor:'#ddd', borderRadius:4, borderWidth:1, alignItems:"center", justifyContent:'center'}}>
                  <Text style={{fontWeight:'600', color:'#333'}}>Sign Out</Text>
              </TouchableHighlight>
            </View>
          </View>

      </View>

      </View>)
  }
  renderPhotos(x){
    return(
      <View style={styles.eachPost}>
      <View style={styles.userSection}>
        <View style={{flex:1,flexDirection:'row'}}>
            <Image source = {{uri: x.author.image}} resizeMode="contain" style={{height:height/10, width:width/10, borderRadius:50}} />

              <View style={styles.userDetails}>
                <Text style={{fontSize:13, fontWeight:'700'}}>{x.author.username}</Text>
                <Text style={{fontSize:11}}>{x.author.major}</Text>
              </View>
        </View>
      </View>

      <TouchableOpacity onPress={() => Actions.detail({'post': x})}>
        <ImageBackground source = {{uri: x.image}} resizeMode="cover" style={{width:width, height:width}} >
            <View style={{alignSelf: 'flex-end', alignItems:'center', justifyContent: 'center', backgroundColor:'rgb(14, 4, 1)', height:60, width:60}}>
               <Text style={{fontSize:22, fontWeight: 'bold', color: '#fff'}}> {Number.parseInt(x.avarage.avarage).toFixed(1)} </Text>
            </View>

        </ImageBackground>
      </TouchableOpacity>

      <View style={styles.likes}>

           </View>

      <View style={{}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Icon name="favorite" size={10} style={{marginLeft:15, marginRight:5}} color="#222" />
          <Text style={{fontSize:12, fontWeight:'600', color:'#333'}}>{x.upvoteCount} Vecihi</Text>
        </View>
        <View style={{ flexDirection:'row', padding:15, paddingBottom:5, paddingTop:4}}>
          <Text style={{fontSize:12, fontWeight:'600'}}>{x.author.username}</Text>
        <View style={{flexDirection:'row'}}>
          <Text style={{fontSize:11, fontWeight:'400', marginLeft:5}}>{x.description} </Text>
        </View>
        </View>

        <Text style={{color:'#777', fontSize:8, margin:10, marginLeft:15,}}>{moment(x.createdAt).fromNow()}</Text>
        </View>


    </View>
      )
  }

  nav(){
    return(<View style={{height:60, flexDirection:'row', paddingLeft:10, paddingRight:10, paddingTop:10, alignItems:'center',justifyContent:'space-between', borderBottomWidth:1, borderBottomColor:'#e7e7e7'}}>
        <TouchableOpacity onPress={() => alert("I'm working on it\n Yasin Toy ")}>
           <Icon name="ios-person-add" size={20} />
        </TouchableOpacity>
      <Text style={{fontWeight:'600', fontSize:16}}>{this.state.info.fullName}</Text>
      <TouchableOpacity onPress={() => Actions.edit_profile({"info": this.state.info, 'token': this.state.token})}>
          <Icon name="ios-cog" size={20} />
      </TouchableOpacity>
      </View>)
  }
  render() {
    return (
      <View style={styles.container}>
      {this.nav()}
      <ScrollView style={{flex:1,}}>
            {this.info()}

        {this.state.loading
            ?
              <ActivityIndicator size="large" color="#0000ff" />
          :
              <View style={{flex:5}}>
                
                  <ListView
                  enableEmptySections={true}
                  removeClippedSubviews={false}
                  contentContainerStyle = {{flexDirection: 'row',
                  flexWrap: 'wrap'}}
                  dataSource = {this.state.images}
                  renderRow = {(rowData) => this.renderPhotos(rowData)}
                  />
            </View>
        }

       </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  userSection:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:10,
  },
  userDetails:{
    flex:1,
    margin:2,
    marginLeft:8,
    alignSelf:'center',
    justifyContent:'center',
  },
  likes:{
    height:40,
    margin:10,
    marginTop:2,
    borderBottomWidth:1,
    borderBottomColor:'#eee',
    flexDirection:"row",
    alignItems:'center'
  }
});
