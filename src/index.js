import React, {Component} from 'react'

import {
   View,
   Text,
   Platform
} from 'react-native'

import {Router, Scene} from 'react-native-router-flux'

import Iconz from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
//import codePush from "react-native-code-push";

import {
    GoogleAnalyticsTracker,
    GoogleTagManager,
    GoogleAnalyticsSettings
  } from "react-native-google-analytics-bridge";

import Splash from './splash'
import Login from './Components/Login/login'
import Home from './Components/Home/home'
import SignUp from './Components/SignUp/signUp'
import CameraApp from './Components/Camera/camera'
import Preview from './Components/Camera/preview'
import Edit from './Components/Camera/edit'
import Profile from './Components/Profile/profile'
import Followers from './Components/Profile/followers'
import Following from './Components/Profile/following'
import WhoViewedMyProfile from './Components/Stalk/who_viewed_my_profile'
import ViewProfile from './Components/Profile/view_profile'
import EditProfile from './Components/Profile/edit_profile'
import Discover from './Components/Discover/discover'
import Detail from './Components/Detail/detail'
import SearchResult from './Components/Discover/search_result'

  
global.tracker = new GoogleAnalyticsTracker("UA-116148106-1");


class HomeIcon extends React.Component {
    render(){
        return (
          <Iconz name ="ios-home-outline" size={23} color="#222" />
        );
    }
}
class DiscoverIcon extends React.Component {
    render(){
        return (
          <Iconz name ="ios-search-outline" size={23} color="#222" />
        );
    }
}

class CameraIcon extends React.Component {
    render(){
        return (
          <Iconz name ="ios-camera-outline" size={23} color="#222" />
        );
    }
}

class StalkerIcon extends React.Component {
    render(){
        return (
          <Iconz name ="ios-glasses-outline" size={23} color="#222" />
        );
    }
}

class ProfileIcon extends React.Component {
    render(){
        return (
          <Iconz name ="ios-person-outline" size={23} color="#222" />
        );
    }
}


export default class Index extends Component{
    componentDidMount(){
        // codePush.sync({
        //     updateDialog: true,
        //     installMode: codePush.InstallMode.IMMEDIATE
        // });
    }
   render(){
      return(
         <Router>
            <Scene key='root'> 
            
            <Scene key='splash' initial={true} component={Splash}  title='splash'   hideNavBar={true}/>
            <Scene key='login' component={Login}  title='login'   hideNavBar={true}/>
            <Scene key='signUp' component={SignUp}  title='signUp'   hideNavBar={true}/>

            <Scene key='detail' component={Detail} hideNavBar={true} title='Detail'/>

            <Scene key="tabbar" tabs={true} tabBarStyle={{backgroundColor:'#fff'}} tabBarPosition='bottom'>
                <Scene key="home" hideNavBar={true}  icon={HomeIcon}>
                    <Scene key="feed" initial={true} component={Home} />
                </Scene>

                <Scene key="discover" hideNavBar={true}  icon={DiscoverIcon} >
                    <Scene key="bests" initial={true} component={Discover} />
                    <Scene key="search_result" component={SearchResult} />
                </Scene>
                <Scene key="camera" hideNavBar={true} hideTabBar={true} icon={CameraIcon}>
                    <Scene key="take" initial={true} component={CameraApp} />
                    <Scene key='preview' component={Preview} title='Preview' hideTabBar={true}/>
                    <Scene key='edit' component={Edit} title='Edit' hideTabBar={true}/>
                </Scene>

                <Scene key="your stalkers"  hideNavBar={true}  icon={StalkerIcon} >
                    <Scene key="who_viewed" initial={true} component={WhoViewedMyProfile} />
                </Scene>

                <Scene key="profile" hideNavBar={true} icon={ProfileIcon}>
                    <Scene key="profile" initial={true} component={Profile}/>
                    <Scene key="edit_profile" component={EditProfile} title="Edit Profile" hideTabBar={true} hideNavBar={true}/>
                    <Scene key="view_profile" component={ViewProfile} title="View Profile" />
                    <Scene key="followers" component={Followers} title="Followers" hideTabBar={true} hideNavBar={true}/>
                    <Scene key="following" component={Following} title="Following" hideTabBar={true} hideNavBar={true}/>
                </Scene>

            </Scene>
        </Scene>
         </Router>
      )
   }
}
