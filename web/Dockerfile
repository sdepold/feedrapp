FROM node:18-alpine AS BUILD_IMAGE

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
ENV PORT 3000

RUN apk update && apk add yarn curl bash python3 g++ make 

WORKDIR /srv/app

COPY . .

RUN yarn --frozen-lockfile
RUN yarn build

# Prune dev dependencies
RUN npm prune --production
RUN curl -sf https://gobinaries.com/tj/node-prune | sh

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]
