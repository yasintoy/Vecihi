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

### Low Memory Usage
#### ![](screen_shots/memoryUsage.png)

### Notification System
**We now have notification system for mac/linux**
#### ![](screen_shots/notification_test.png)

## TODO

* [Real time chat](https://github.com/yasintoy/Slack-Gitsin/issues/6)

## Contributing 
- Fork the repo
- Branch it in your development environment (this is required if only you are willing to contribute frequently)
- Hack in
- Make a pull request
- Chill

## License
[MIT GENERAL PUBLIC LICENSE](LICENSE)
