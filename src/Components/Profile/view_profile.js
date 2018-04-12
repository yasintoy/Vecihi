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

import Icon from 'react-native-vector-icons/MaterialIcons';
import Iconz from 'react-native-vector-icons/Ionicons';

import {Rating} from 'react-native-elements'


var p = -1;

var {height, width} = Dimensions.get('window');
var imageSize = (width/3) - 1

const ACCESS_TOKEN = 'access_token'

import website_url from "../../../config"
const WATER_IMAGE = require('../../images/water.png')


var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ViewProfile extends Component {
  constructor(props){
    super(props)
    this.state = {
      images: ds.cloneWithRows([]),
      info: {},
      token: '',
      anonymous: this.props.anonymous,
      user_id: this.props.user_id,
      loading: false
    }
  }
  async getImages(){
    this.setState({loading: true})
    let url = website_url + "api/v1/user/"+ this.state.user_id + "/posts/"
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

  async follow(){
      var url = website_url + 'api/v1/follow/' + this.state.user_id + '/'
      let data = {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json',
           'Authorization': 'Token ' + this.state.token
        }
     }
     if (!this.state.info.am_I_following){
        let response =  await fetch(url, data)
        if(response.status >= 200 && response.status <= 300){
          let newData = this.state.info
            newData.am_I_following = true;
            newData.followers = newData.followers + 1
            this.setState({info: newData})
      }else{
          alert(response._bodyText)
      }
     }else{
       alert("Bizde geri vites yok :) ")
     }
    
  }

  async getInfo(){
      var url = website_url + 'api/v1/accounts/' + this.state.user_id + '/'

       let token = await AsyncStorage.getItem(ACCESS_TOKEN)
       this.setState({
           token: token,
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
    global.tracker.trackScreenView("ViewProfile")
    this.getInfo().then(() => {
        this.getImages()
    })

  }


  metrics(){
    return(
      <View style={{flex:2, margin:15, marginBottom:5, flexDirection:'row', justifyContent:'space-around'}}>
      <View style={{alignItems:"center", margin:15, justifyContent:'center'}}>
        <Text style={{fontWeight:'400', fontSize:18}}>{this.state.info.totalPosts}</Text>
        <Text style={{color:"#888", fontSize:13}}>posts</Text>
      </View>
      <TouchableHighlight onPress={() => Actions.followers({'user_id': this.state.user_id})}>
        <View style={{alignItems:"center", margin:15, justifyContent:'center'}}>
          <Text style={{fontWeight:'400', fontSize:18}}>{this.state.info.followers}</Text>
          <Text style={{color:"#888", fontSize:13}}>followers</Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => Actions.following({'user_id': this.state.user_id})}>
        <View style={{alignItems:"center", margin:15, justifyContent:'center'}}>
          <Text style={{fontWeight:'400', fontSize:18}}>{this.state.info.following}</Text>
          <Text style={{color:"#888", fontSize:13}}>following</Text>
        </View>
      </TouchableHighlight>

      </View>
    )
  }
  follow_style = function(){
          return({
              width:240,
              height:30,
              margin:5,
              borderColor:'#ddd',
              borderRadius:4,
              borderWidth:1,
              alignItems:"center",
              justifyContent:'center',
              backgroundColor: this.state.info.am_I_following ? 'white' : 'blue'
          })

  }
  info(){
    return(<View style={{flex:2, padding:10, paddingTop:10}}>
      <View style={{flex:3, alignItems:'center', justifyContent:'center'}}>
        <Image source ={{uri : this.state.info.image}} resizeMode = "cover" style={{width:80, height:80, borderRadius:40}} />

        <View style={{flex:2, justifyContent:'center', alignItems:'center', paddingTop:10}}>
          <Text style={{fontWeight:'400', fontSize:14}}>{this.state.info.bio}</Text>
          <Text style={{fontWeight:'400', fontSize:14, color:'#2f89bd'}}>{this.state.info.major}</Text>
        </View>

          <View style={{flex:3}}>
              {this.metrics()}
            <View style={{flex:2, alignItems:'center'}}>
              <TouchableHighlight onPress={() => this.follow(this.state.info)} style={this.follow_style()}>
                  {
                      this.state.info.am_I_following
                          ?
                            <Text style={{fontWeight:'600', color:'#333'}}>Following</Text>
                          :
                            <Text style={{fontWeight:'600', color:'#fff'}}>Follow</Text>
                  }

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
                <Text style={{fontSize:11}}>{x.author.fullName}</Text>
              </View>
        </View>
      </View>

        <ImageBackground source = {{uri: x.image}} resizeMode="cover" style={{width:width, height:width}} >
            <View style={{alignSelf: 'flex-end', alignItems:'center', justifyContent: 'center', backgroundColor:'rgb(14, 4, 1)', height:60, width:60}}>
               <Text style={{fontSize:22, fontWeight: 'bold', color: '#fff'}}> {Number.parseInt(x.avarage.avarage).toFixed(1)} </Text>
            </View>

        </ImageBackground>

        <View style={styles.likes}>
                {
                  x.isUpvotedMe
                      ?
                        <Text> You have already upvoted! </Text>
                      :
                      <Rating
                      type='custom'
                      ratingImage={WATER_IMAGE}
                      ratingColor='red'
                      ratingBackgroundColor='#c8c7c8'
                      ratingCount={10}
                      imageSize={30}
                      showRating={false}
                      readonly={x.isUpvotedMe}
                      startingValue={Number.parseFloat(x.avarage.avarage).toFixed(1)}
                      onFinishRating={(rating) => this.ratingCompleted(rating, x.id)}
                      style={{ paddingVertical: 20, paddingBottom:5, left:20 }}
                    />

                }
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
  saved(){
    <View ></View>
  }
  nav(){
    return(
    <View style={styles.nav1}>
      <TouchableOpacity onPress={() => Actions.pop()} style={{flex:1, alignItems:'flex-start', justifyContent:"center"}}>
          <Iconz name = "ios-arrow-round-back-outline" color="#222" size={40} style={{margin:3,}} />
      </TouchableOpacity>
    </View>
  )
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
  nav1: {
    height:40,
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor:'#fff',
    padding:15,
    marginTop:5,
    justifyContent:'space-between',
    alignItems:'center',
    height:50,
    paddingBottom:5,
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
