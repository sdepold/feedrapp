#!/bin/bash

# start versioning
pushd api
npm version minor
version=$(node -e "console.log(require('./package.json').version)")
popd

pushd web
npm version $version
popd

git commit -am "Bump to v$version";
git push
git push --tags
# end versioning

# build the api
pushd api
docker build --platform=linux/amd64 -t "ghcr.io/sdepold/feedr-api:$version" .
docker push "$ghcr.io/sdepold/feedr-api:$version"
popd

# build the web
pushd web
docker build --platform=linux/amd64 -t "ghcr.io/sdepold/feedr-web:$version" .
docker push "ghcr.io/sdepold/feedr-web:$version"
popd
