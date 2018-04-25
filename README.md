# ![Vecihi](src/images/vecihi_logo2.png)

Introduction
=================

> * I made a vecihi that provides your own photo sharing app like Instagram in 5 minutes for ios and android. In app side, i used react-native also django for the backend side. Also, many components can be used for your own startup or new project. *

# ![](screen_shots/vecihi.gif)

## Table of Contents
- [Installation](#installation)
- [Deployment](#deployment)
- [TODO](#todo)
- [Getting Started](#getting-started)
- [Features](#features)
- [Screens](#screens)
- [Contributing](#contributing)
- [License](#license)


## Installation

**For Backend :**
Before start, please cd into `Backend` folder. I didn't want to split backend and front-end in the different repository.

```
virtualenv env -p python2
source env/bin/active
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver --settings='config.settings.local'

```

**For React Native :**
```
npm install
react-native link
react-native run-android or
react-native run-ios

```

## Deployment
Before start, please change `Backend/ansible/hosts` and `Backend/ansible/vars.yml` with your own infos.

```
ansible-playbook -i hosts deploy.yml -v
ansible-playbook -i hosts provision.yml   -v

```
When the installation completed, add your api url to `config.py`.

## TODO

- [ ] Real time chat
- [ ] Videos Support
- [ ] Stories (I've already implemented it but not yet used)
- [ ] Change our Components with Presentational and Container Components [Dan Abramov's article] (https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [ ] Use Redux (Why I didn't use in the first init I dont know :()

## Getting Started

Before start, you should add your server ip adress (http://127.0.0.1:8000/ or server ip) to `config.js`

## Features

### Take or upload a photo
#### <img src="screen_shots/15.png" width="500" height="500">

### See Who Visited Your Profile 
#### <img src="screen_shots/17.png" width="500" height="500">

### Discover Most Popular Posts
#### <img src="screen_shots/18.png" width="500" height="500">

### Vote Images and see avarage points
#### <img src="screen_shots/19.png" width="500" height="500">

### No Private Profile
#### <img src="screen_shots/20.png" width="500" height="500">

### Django provides a admin page for you
#### <img src="screen_shots/21.png" width="800" height="600">

### Api Documentation (You can see list of api urls)
#### <img src="screen_shots/23.png" width="800" height="600">

### Api Call Example
#### <img src="screen_shots/24.png" width="800" height="600">

## Screens

### Splash
#### ![](screen_shots/1.png)

### Register
`Department field is university major. If you don't want use in your own project, you can remove( Be sure that you changed required=False in backend Side. I'll handle with this in the future)`

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
