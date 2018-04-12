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
  ScrollView,
  Dimensions,
  Image,
  ImageBackground,
  Text,
  View
} from 'react-native';

import {Rating} from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import moment from 'moment'

var {height, width} = Dimensions.get('window');

import Icon from 'react-native-vector-icons/MaterialIcons';
import Iconz from 'react-native-vector-icons/Ionicons';

const WATER_IMAGE = require('../../images/water.png')

export default class Detail extends Component {
  constructor(props){
    super(props)

    this.state = {
      post: this.props.post,
      token: this.props.token
    }

  }

  componentDidMount(){
    global.tracker.trackScreenView("Detail")
  }

  async ratingCompleted(rating){
    this.setState({loading: true})
    try{
        let url = website_url + "api/v1/posts/" + post.id + "/upvote/"
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

          let response =  await fetch(url, data)
          let res =  await response.json()
          if(response.status >= 200 && response.status <= 300){
                this.setState({starCount: rating})
          }else{
             throw res;
          }
    }catch(e){
        //console.log("error -> " + e);
        alert('error: ' + e)
    }

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

        <ScrollView style={styles.container}>
            <View style={styles.eachPost}>
              <View style={styles.userSection}>
                <View style={{flex:1,flexDirection:'row'}}>
                  <Image source = {{uri: this.state.post.author.image}} resizeMode="contain" style={{height:30, borderRadius:15, backgroundColor:'#f3f3f3', width:30}} />
                  <TouchableHighlight style={styles.userDetails} onPress={() => Actions.view_profile({'user_id': this.state.post.author.id, 'anonymous': false})}>
                      <View>
                        <Text style={{fontSize:13, fontWeight:'700'}}>{this.state.post.author.username}</Text>
                        <Text style={{fontSize:11}}>{this.state.post.title}</Text>
                      </View>
                  </TouchableHighlight>
                </View>
                <View style={{flex:1, alignItems:'flex-end'}}>
                  <Icon name="more-horiz" size={20} color="#888" />
                </View>
              </View>

              <Image style={{width:width, height:width}} source={{uri: this.state.post.image,}} resizeMode='cover'
              />

              {/* <ImageBackground source = {{uri: this.state.post.image}} resizeMode="cover" style={{width:width, height:width}} >
                    <View style={{alignSelf: 'flex-end', alignItems:'center', justifyContent: 'center', backgroundColor:'rgb(14, 4, 1)', height:60, width:60}}>
                    <Text style={{fontSize:24, fontWeight: 'bold', color: '#fff'}}> {Number.parseInt(this.state.post.avarage.avarage).toFixed(1)} </Text>
                    </View>
            </ImageBackground> */}

            <View style={styles.likes}>
            {
              this.state.post.isUpvotedMe
                  ?
                    <Text> You have already upvoted! </Text>
                  :
                    <Rating
                      type='custom'
                      readonly
                      ratingImage={WATER_IMAGE}
                      ratingColor='red'
                      ratingBackgroundColor='#c8c7c8'
                      ratingCount={10}
                      imageSize={30}
                      onFinishRating={this.ratingCompleted}
                      style={{ paddingVertical: 20, paddingBottom:5, left:20 }}
                    />
              }
         </View>

    <View style={{}}>
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <Icon name="favorite" size={10} style={{marginLeft:15, marginRight:5}} color="#222" />
        <Text style={{fontSize:12, fontWeight:'600', color:'#333'}}>{this.state.post.upvoteCount} Vecihi</Text>
      </View>
      <View style={{ flexDirection:'row', padding:15, paddingBottom:5, paddingTop:4}}>
        <Text style={{fontSize:12, fontWeight:'600'}}>{this.state.post.user}</Text>
      <View style={{flexDirection:'row'}}>
        <Text style={{fontSize:11, fontWeight:'400', marginLeft:5}}>{this.state.post.description} </Text>
      </View>
      </View>

      <Text style={{color:'#777', fontSize:8, margin:10, marginLeft:15,}}>{moment(this.state.post.createdAt).fromNow()}</Text>
      </View>

            </View>
        </ScrollView>

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
