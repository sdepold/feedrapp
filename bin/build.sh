#!/bin/bash

# bump package.json version to next minor
npm version minor
git push

version=$(node -e "console.log(require('./package.json').version)")
image_base_bame=ghcr.io/sdepold/feedr

# build the new docker images
docker build -t "$image_base_bame:$version" .
docker build --platform=linux/amd64 -t "$image_base_bame-amd64:$version" .
docker build --platform=linux/arm64 -t "$image_base_bame-arm64:$version" .

# push images to registry
docker push "$image_base_bame:$version"
docker push "$image_base_bame-amd64:$version"
docker push "$image_base_bame-arm64:$version"
