# feedrapp
[![Travis build status](http://img.shields.io/travis/sdepold/feedrapp.svg?style=flat)](https://travis-ci.org/sdepold/feedrapp)
[![dependencies Status](https://david-dm.org/sdepold/feedrapp/status.svg)](https://david-dm.org/sdepold/feedrapp)
[![devDependencies Status](https://david-dm.org/sdepold/feedrapp/dev-status.svg)](https://david-dm.org/sdepold/feedrapp?type=dev)

A service for parsing RSS and Atom feeds.

## Documentation

Please see https://feedrapp.info for further information.

## Systemd Service

Once you have downloaded this repository to your desired location, you can install it as
a `systemd` service. Update `systemd/feedr.service` `WorkingDirectory` and `ExecStart`
parameters to point to the location of your cloned repository. Then execute the following:

```bash
cd systemd
sudo make install
```

## Load Balanced Hosting

### Spawn the load balancer

```bash
rm Procfile
mv Procfile-LB Procfile
git commit -m "Use LB Procfile"
git push heroku master
```

### Spawn the workers

```
git push heroku master
```

### tmuxinator

Assumption:

You have the folders `~/Projects/feedr-app-[1-9]`:

```
brew install tmuxinator
tmuxinator local
```

[Controls](https://tmuxcheatsheet.com/)