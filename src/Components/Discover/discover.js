/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  View,
  AsyncStorage,
  ListView,
  TouchableHighlight
} from 'react-native';

var {height, width} = Dimensions.get('window');

import Icon from 'react-native-vector-icons/MaterialIcons';
import Iconz from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements'

import website_url from "../../../config"
import { Actions } from 'react-native-router-flux';
const ACCESS_TOKEN = 'access_token'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var black = "rgba(0,0,0,0.6)";
var blue = "rgba(0,185,242,0.6)"
var blueI = "rgba(0,185,242,1)"


export default class Discover extends Component {
  
    constructor (props) {
        super(props);
        this.state = {
            posts: [],
            loading: false,
            token: '',
            search_query: '',
            mostUpvotedAllTimes: ds.cloneWithRows([]),
            mostUpvotedLastWeek: ds.cloneWithRows([]),
            bestOfMarmara: ds.cloneWithRows([])
        };
    }

    async getPosts(){
        this.setState({loading: true})
        var url = website_url + "api/v1/best-posts"
         let data = {
          method: 'GET',
          headers: {
              'Content-Type' : 'application/json',
              'Authorization' : 'Token ' +  this.state.token
          }
        }
         await fetch(url, data)
            .then(response => response.json())
            .then(jsonData => {
               this.setState({
                  bestOfMarmara: this.state.bestOfMarmara.cloneWithRows(jsonData.results.bestOfMarmara),
                  mostUpvotedAllTimes: this.state.mostUpvotedAllTimes.cloneWithRows(jsonData.results.mostUpvotedAllTimes),
                  mostUpvotedLastWeek: this.state.mostUpvotedLastWeek.cloneWithRows(jsonData.results.mostUpvotedLastWeek),
                  loading:false,
               })
            })
            .catch(error =>{
                //console.log('error: ' + error)
                this.setState({loading: false})
            })
      }
    
      componentWillMount(){
         this.getToken()
         global.tracker.trackScreenView("Discover")
      }
    
      getToken(){
              AsyncStorage.getItem(ACCESS_TOKEN).then((access_token) => {
                this.setState({
                  token: access_token
              })
              this.getPosts()
            })
          .catch((e) => {
              //console.log(e);
          })
      }

  eachPost(x, y){
    var iconColorX
    var locationColorX
    var iconColorY
    var locationColorY
    var blueI = "rgba(0,185,242,1)"

    if(x.color == black){
      iconColorX = "#e3e3e3"
      locationColorX = blueI
    }else{
      iconColorX = "#fff"
      locationColorX = "#fff"
    }
  
    return(
      <TouchableHighlight onPress={() => Actions.detail({'post': x})} style={{flex:1, width:width, height:height}}>
        <ImageBackground source={{uri: x.image}} resizeMode='cover' style={{position:"absolute", height:height/1.2, width:width-10, alignItems:'flex-end'}}>
          <View style={{backgroundColor:x.color, height:110, width:150, }}>
            <TouchableOpacity onPress={() => Actions.view_profile({'user_id': x.author.id, 'anonymous': false})} style={{flex:5, justifyContent:'center', alignItems: 'flex-end', right: 5}}>
              <Image source={{uri: x.author.image}} style={{height:50, width:50, borderRadius: 25, marginBottom: 5}}/>
              <Text style={{color:blueI, fontWeight:'700', fontSize:12}}>@{x.author.username}</Text>
            </TouchableOpacity>
          </View>

          <View style={{alignSelf: 'flex-start', marginTop: 30, marginLeft: 10, position: 'absolute'}}>
            <Text style={{color: blueI, fontSize: 30}}>  {Number.parseInt(x.avarage.avarage).toFixed(1)} </Text>
         </View>
        </ImageBackground>

      </TouchableHighlight>
      )
  }  
  
  nav(){
      return(
          <View style={{height:50, paddingBottom:10}}> 
                <SearchBar
                lightTheme
                autoCapitalize='none'
                onChangeText={(value) => this.setState({search_query: value})}
                onSubmitEditing={() => Actions.search_result({"search_query": this.state.search_query})}
                icon={{ type: 'font-awesome', name: 'search' }}
                placeholder='Search a user, major etc ...' />
          </View>
      )
  }

  renderTitle(titleText){
    return (
          <View style={{backgroundColor:blueI, justifyContent: 'center', alignItems: 'center', height:height/1.2, width: width/2}}>
                <Text style={{color: 'white', fontSize:20, textAlign:'center'}}>{titleText}</Text>
                <Iconz name="ios-bicycle" size={40} color="#fff" />
            </View>
      )

  }

  render() {
    return (
      <View style={{flex:1}}> 
        {this.nav()}
        <ScrollView enableEmptySections={true}>
          <ListView 
              removeClippedSubviews={false}
                enableEmptySections={true}
                horizontal={true} 
                dataSource={this.state.bestOfMarmara} 
                renderRow={(post) => this.eachPost(post)}
                renderHeader={() => this.renderTitle("Best Of Marmara")}/>
            <ListView 
                removeClippedSubviews={false}
                horizontal={true} 
                dataSource={this.state.mostUpvotedAllTimes} 
                renderRow={(post) => this.eachPost(post)}
                renderHeader={() => this.renderTitle("Most 'Vecihi's All The Times")}/>
            
            <ListView 
                removeClippedSubviews={false}
                horizontal={true} 
                dataSource={this.state.mostUpvotedLastWeek} 
                renderRow={(post) => this.eachPost(post)}
                renderHeader={() => this.renderTitle("Most 'Vecihi's Last Week")}/>
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',

}}
);
