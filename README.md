# feedr
[![Travis build status](http://img.shields.io/travis/sdepold/feedr.svg?style=flat)](https://travis-ci.org/sdepold/feedr)
[![Dependency Status](https://david-dm.org/sdepold/feedr.svg)](https://david-dm.org/sdepold/feedr)
[![devDependency Status](https://david-dm.org/sdepold/feedr/dev-status.svg)](https://david-dm.org/sdepold/feedr#info=devDependencies)

A service for parsing RSS and Atom feeds.

## Getting started

```
git clone git@github.com:sdepold/feedr.git
cd feedr
npm install
bin/feedr.js
```

You can now run the app and start parsing your feeds:

```
http://localhost:8080/?q=http://blog.depold.com/rss/
```

## Supported query paramaters:

- q: Mandatory. The encoded URL of the feed.
- num: Optional. Number of entries to load.

## Response format

The responses will follow the Google RSS API format which is documented here:
https://developers.google.com/feed/v1/reference?hl=de#resultJson
