# ![Vecihi](src/images/vecihi_logo2.png)

The Problem
=================
> *Nowadays, almost everyone says 
- 'Hey! we have an idea and probably we'll be rich. 
- Then, I'm asking what's the idea? 
- Do you know instagram or facebook?*
- Yeap
- think instagram without videos. its gone be awesome. Society needs this app 
- :tired_face: Are you kidding me?

> *So I made a vecihi that provides your own photo sharing app like instagram in 5 minutes for ios and android. In app side, i used react-native also django for the backend side *
> *I really tired of social media clone app startups. World doesn't need a new instagram,facebook or snapchat etc. Be creatiful and solve the world problems.*

# ![](screen_shots/anim.gif)

## Table of Contents
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Features](#features)
- [Screens](#screens)
- [TODO](#todo)
- [Contributing](#contributing)
- [License](#license)


## Installation

**For Backend :**
```
virtualenv env -p python2
source env/bin/active
pip install -r requirements/base.txt requirements/local.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

```

**For React Native :**
```
npm install
react-native link
react-native run-android or
react-native run-ios

```
When the installation completes, add your api url to `config.py`.

## Getting Started

Before start, you should add your server ip adress (http://127.0.0.1:8000/ or server ip) to `config.js`

## Features

### Take or upload a photo
#### <img src="screen_shots/15.png" width="500" height="500">

### Share
#### <img src="screen_shots/16.png" width="500" height="500">

### See Who Visited Your Profile 
#### <img src="screen_shots/17.png" width="500" height="500">

### Discover Most Popular Posts
#### <img src="screen_shots/18.png" width="500" height="500">

### Vote Images and see avarage points
#### <img src="screen_shots/19.png" width="500" height="500">

### No Private Profile
#### <img src="screen_shots/20.png" width="500" height="500">

## Screens

### Splash
#### ![](screen_shots/1.png)

### Register
#### ![](screen_shots/2.png)

### Login
#### ![](screen_shots/3.png)

### Home
#### ![](screen_shots/4.png)

### Post Detail
#### ![](screen_shots/14.png)

### Discover
#### ![](screen_shots/5.png)

### Profile
#### ![](screen_shots/11.png)

### Camera
#### ![](screen_shots/6.png)

### Photo Library
#### ![](screen_shots/7.png)

### Preview
#### ![](screen_shots/8.png)

### Edit
#### ![](screen_shots/9.png)

### Who Visited Your Profile
#### ![](screen_shots/10.png)

### Edit Your Profile
#### ![](screen_shots/12.png)



## TODO

- [ ] Real time chat
- [ ] Videos Support
- [ ] Stories (I've already implemented it but not yet used)

## Contributing 
- Fork the repo
- Branch it in your development environment (this is required if only you are willing to contribute frequently)
- Hack in
- Make a pull request
- Chill

## License
MIT License

Copyright (c) 2018 Yasin Toy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
