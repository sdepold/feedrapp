# Change Log
All notable changes to this project will be documented in this file.

## v1.5.1 - 2017-07-12
### Changed
- Caching mechanism was moved to Express middleware
- Performance of cache hits was dramatically improved (up to 1000 times faster)
- Change should have huge impact on overall throughput of the app

Example of previous cache mechanism hit (13.195ms)

```
GET /?callback=jQuery17106703896443208608_1499890351317&q=http%3A%2F%2Ffeeds.feedburner.com%2FDawanda&num=3&_=1499890351593 200 13.195 ms
```

Example of new cache mechanism hit (0.013ms)

```
isApiRequest=true&path=%2F&callback=callback&q=http%3A%2F%2Ffeeds.feedburner.com%2FDawanda&num=3: 0.013ms
```

## v1.5.0 - 2017-02-10
### Added
- Caching of requested RSS feeds for 30 minutes in memory

## v1.4.0 - 2016-08-13
### Added
- Support for media:thumbnail extension

### Fixed
- Version of Node.JS on Heroku

## v1.3.0 - 2015-09-08
### Added
- Support for plain categories in RSS feeds

## v1.2.1 - 2015-08-25
### Added
- Strip line separators

## v1.2.0 - 2015-08-23
### Added
- Logging of request summary
- Note about callback param
- Test for feed parsing

### Changed
- Respond to all URL paths

## v1.1.1 - 2015-08-21
### Changed
- Properly format errors

## v1.1.0 - 2015-08-21
### Added
- Support for limiting entries

### Changed
- Rename feedUrl param to q

## v1.0.1 - 2015-08-20
### Added
- Use feed author as fallback for entries

## v1.0.0 - 2015-08-20
### Added
- Initial version
