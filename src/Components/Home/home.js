/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  ListView,
  FlatList,
  ScrollView,
  Dimensions,
  RefreshControl,
  Image,
  ImageBackground,
  Text,
  View,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';

import {Rating} from 'react-native-elements'
import {Actions} from 'react-native-router-flux'
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2
};

let containerCount = 0;

import website_url from "../../../config"

var {height, width} = Dimensions.get('window');
var p = -1;
var black = "rgba(0,0,0,0.6)";

import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Iconz from 'react-native-vector-icons/Ionicons';

import StarRating from 'react-native-star-rating';

const ACCESS_TOKEN = 'access_token'
const WATER_IMAGE = require('../../images/water.png')


let dataProvider = new DataProvider((r1, r2) => {
  return r1 !== r2;
});

export default class Home extends Component {
  constructor(props){
    super(props);

  this._layoutProvider = new LayoutProvider(
    index => {
            return ViewTypes.FULL;
       
    },
    (type, dim) => {
        switch (type) {
            case ViewTypes.FULL:
                dim.width = width;
                dim.height = height - 50;
                break;
            default:
                dim.width = 0;
                dim.height = 0;
        }
    }
);

this._rowRenderer = this._rowRenderer.bind(this);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      loading: false,
      refreshing: false,
      isLoadingMore:false,
      token: '',
      next_url: '',
      starCount: 3.5,
      post_id: '',
      posts: dataProvider.cloneWithRows([]),
      store: [],
      selectedIndex: 0
    }

}
  async ratingCompleted(rating, post_id){
    global.tracker.trackEvent("Action", "rating", {rating: rating, which_post: post_id})
    try{
        let url = website_url + "api/v1/posts/" + post_id + "/upvote/"
          let data = {
            method: 'POST',
            body: JSON.stringify({
                "point":  rating
            }),
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Token ' +  this.state.token
            }
          }
          //this.setState({loading: true})
          let response =  await fetch(url, data)

          if(response.status >= 200 && response.status <= 300){
            let newArray = this.state.posts._data.slice()
            let oldUpvoteCount = this.state.posts._data[this.state.selectedIndex].upvoteCount
            newArray[this.state.selectedIndex] = {
              ...this.state.posts._data[this.state.selectedIndex],
              avarage: {
                  avarage: ( (this.state.posts._data[this.state.selectedIndex].avarage.avarage * oldUpvoteCount) + parseInt(rating) ) / (oldUpvoteCount+1),
              },
              upvoteCount: oldUpvoteCount + 1,
              isUpvotedMe: true
            }
            this.setState({posts: this.state.posts.cloneWithRows(newArray)})
            //this._onRefresh.bind(this)
            //this.forceUpdate();
          }else{
              alert(response._bodyText)
          }
          //this.setState({loading: false})
    }catch(e){
        //console.log("error -> " + e);
        alert('error: ' + e.message)
       // this.setState({loading: false})
    }

  }

  getPosts(swipe_refresh=false){
    this.setState({loading: true})
     if (this.state.next_url == '' || swipe_refresh) {
        var url = website_url + "api/v1/posts/?sorting=newest"
     }else {
       var url = this.state.next_url
     }
     let data = {
      method: 'GET',
      headers: {
          'Content-Type' : 'application/json',
          'Authorization' : 'Token ' +  this.state.token
      }
    }
     fetch(url, data)
        .then(response => response.json())
        .then(jsonData => {
           this.setState({
              posts: this.state.posts.cloneWithRows(jsonData.results),
              loading:false,
              next_url: jsonData.next,
              store: jsonData.results
           })
        })
        .catch(error =>{
            //console.log('error: ' + error)
            this.setState({loading: false})
        })
  }

  componentDidMount(){
     this.getToken()
     global.tracker.trackScreenView("Home")
    }

  async getToken(){
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

nav(){
  return(<View style={styles.nav1}>
    <TouchableOpacity onPress={() => Actions.camera()}>
        <Image source ={require('../../images/topcam.png')} resizeMode="contain" style={{height:20, width:20}} />
    </TouchableOpacity>
    <View style={{width:130, alignItems:'center', justifyContent:"center", height:40, borderBottomWidth:2, borderBottomColor:'#333'}}>
        <Image source ={require('../../images/vecihi_logo.png')} resizeMode="cover" style={{height:50, width:110}} />
    </View>
    <TouchableOpacity onPress={() => Actions.discover()}>
        <Image source ={require('../../images/discover.png')} resizeMode="contain" style={{height:25, width:25}} />
    </TouchableOpacity>
    </View>)
}

  eachStory(x){
    return(<TouchableOpacity onPress={() => Actions.stories({'token': this.state.token})} style={{paddingTop:0, margin:10, height:85, justifyContent:'center', alignItems:'center'}}>
      <Image source ={x} style={{width:60, height:60, marginBottom:8, borderRadius:30}} resizeMode = "contain" />
      </TouchableOpacity>)
  }


liked(){
  return(
    <View> <Iconz name = "ios-heart" color="red" size={22} style={{margin:3,}} /> </View>
  )
}

unliked(post_id){
  return(
      <TouchableOpacity onPress={() => this.upVote(post_id)}>
          <Iconz name = "ios-heart-outline" color="#222" size={22} style={{margin:3,}} />
      </TouchableOpacity>
  )
}

_rowRenderer(type, x, index){
  this.setState({"selectedIndex": index-1})

  return(
    <View style={styles.eachPost}>
      <View style={styles.userSection}>
        <View style={{flex:1,flexDirection:'row'}}>

          <TouchableOpacity onPress={() => Actions.view_profile({'user_id': x.author.id, 'anonymous': false}) }>
            <Image source = {{uri: x.author.image}} resizeMode="contain" style={{height:30, width:30, borderRadius:15}} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.userDetails} onPress={() => Actions.view_profile({'user_id': x.author.id, 'anonymous': false})}>
              <View>
                <Text style={{fontSize:13, fontWeight:'700'}}>{x.author.username}</Text>
                <Text style={{fontSize:11}}>{x.author.major}</Text>
              </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => Actions.view_profile({'user_id': x.author.id, 'anonymous': true}) } style={{flex:1, alignItems:'flex-end'}}>
          <Iconz name="ios-glasses-outline" size={40} color="#888" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => Actions.detail({'post': x})}>
        <ImageBackground source={{uri: x.image}}  style={{width:width, height:width}} resizeMode="cover">
            <View style={{alignSelf: 'flex-end', alignItems:'center', justifyContent: 'center', backgroundColor:black, height:60, width:60}}>
               <Text style={{fontSize:22, fontWeight: 'bold', color: '#fff'}}> {Number.parseInt(x.avarage.avarage).toFixed(1)} </Text>
            </View>
        </ImageBackground>
      </TouchableOpacity>

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
          <Text style={{fontSize:12, fontWeight:'600', color:'#333'}}>{x.upvoteCount} vecihi</Text>
        </View>
        <View style={{ flexDirection:'row', padding:15, paddingBottom:5, paddingTop:4}}>
          <Text style={{fontSize:12, fontWeight:'600'}}>{x.author.username}</Text>
        <View style={{flexDirection:'row'}}>
          <Text style={{fontSize:11, fontWeight:'400', marginLeft:5}}>{x.description} </Text>
        </View>
        </View>

        <Text style={{color:'#777', fontSize:8, margin:10, marginLeft:15,}}>{moment(x.createdAt).fromNow()}</Text>
        </View>


    </View>)
}
stories(){
  return( <ListView
        horizontal = {true}
        style={{backgroundColor:'#f3f3f3'}}
        showsHorizontalScrollIndicator = {false}
        renderRow = {(rowData) => this.eachStory(rowData)}
        dataSource = {this.state.stories}
        refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
        />)
}

_onRefresh(){
  this.getPosts(swipe_refresh=true)
}

getFooterPosts(){
  var url = this.state.next_url
  let data = {
  method: 'GET',
  headers: {
      'Content-Type' : 'application/json',
      'Authorization' : 'Token ' +  this.state.token
  }
  }
  fetch(url, data)
    .then(response => response.json())
    .then(jsonData => {
        var newData = []
        newData = this.state.store.concat(jsonData.results)

        this.setState({
          posts: this.state.posts.cloneWithRows(newData),
          next_url: jsonData.next,
          store: newData
        })
    })
    .catch(error =>{
        console.log('error: ' + error)
    })
}

_onFooterRefresh(){
  this.setState({isLoadingMore: true})

  if(this.state.next_url != ''){
    this.getFooterPosts()
  }else{
    this.setState({
        isLoadingMore: false
    })
  }

  this.setState({isLoadingMore: false})
  
}
  render() {
    return (
    <View style={styles.container}>
        {this.nav()}

        {this.state.loading ? <ActivityIndicator size="large" color="#0000ff" />  : 

<RecyclerListView 
      layoutProvider={this._layoutProvider} 
      dataProvider={this.state.posts} 
      rowRenderer={(type, data, index) => this._rowRenderer(type, data, index)}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={this.state.loading}
          onRefresh={() => this._onRefresh()}
        />
      }
      onEndReached={() => this._onFooterRefresh()}
      renderFooter={() => {
        if(this.state.isLoadingMore){
            return (
              this.state.isLoadingMore &&
              <View style={{ flex: 1 }}>
                <ActivityIndicator size="small" />
              </View>
            );
        }else{
           
        }

     }} 
     />
    
                
              }
      

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },userSection:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:10,
  },userDetails:{
    flex:1,
    margin:2,
    marginLeft:8,
    alignSelf:'center',
    justifyContent:'center',
  },nav1:{
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor:'#e7e7e7',
    padding:15,
    marginTop:5,
    justifyContent:'space-between',
    alignItems:'center',
    height:50,
    paddingBottom:5,
  },
  likes:{
    height:40,
    margin:20,
    marginTop:2,
    borderBottomWidth:1,
    borderBottomColor:'#eee',
    flexDirection:"row",
    alignItems:'center'
  },
  comments:{
    flex:3
  },
  row:{
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems:'flex-start'
  }
});
