# feedrapp
[![Travis build status](http://img.shields.io/travis/sdepold/feedrapp.svg?style=flat)](https://travis-ci.org/sdepold/feedrapp)
[![dependencies Status](https://david-dm.org/sdepold/feedrapp/status.svg)](https://david-dm.org/sdepold/feedrapp)
[![devDependencies Status](https://david-dm.org/sdepold/feedrapp/dev-status.svg)](https://david-dm.org/sdepold/feedrapp?type=dev)

A service for parsing RSS and Atom feeds.

## Getting started

```
git clone git@github.com:sdepold/feedrapp.git
cd feedrapp
npm install
npm start
```

You can now run the app and start parsing your feeds:

```
http://localhost:8080/?q=http://blog.depold.com/rss/
```

## Supported query paramaters:

- q: Mandatory. The encoded URL of the feed.
- callback: Optional. Wraps the answer in a function call, which makes it compatible to JSONP calls.
- num: Optional. Number of entries to load.

## Response format

The responses will follow the Google RSS API format which is documented here:
https://developers.google.com/feed/v1/reference?hl=de#resultJson

## Run your own feedrapp

The easiest way to run your own dedicated version of feedrapp is probably via heroku:

```
git clone git@github.com:sdepold/feedrapp.git
cd feedrapp
heroku create
git push heroku master
heroku open
```
