#!/bin/bash

# bump package.json version to next minor
npm version minor
git push

version=$(node -e "console.log(require('./package.json').version)")
image_base_name=ghcr.io/sdepold/feedr
image_name="$image_base_name:$version"

# build the new docker images
# docker build  -t "$image_name" .
# docker build --platform=linux/arm64 -t "$image_name" .
docker build --platform=linux/amd64 -t "$image_name" .

# push images to registry
docker push "$image_name"
