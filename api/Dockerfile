FROM node:18-alpine AS BUILD_IMAGE

RUN apk update && apk add yarn curl bash python3 g++ make 

WORKDIR /srv/app

COPY package.json yarn.lock ./

# install dependencies
RUN yarn --frozen-lockfile

COPY . .

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
ENV PORT 4000

# remove development dependencies
RUN npm prune --production

# run node prune
RUN curl -sf https://gobinaries.com/tj/node-prune | sh

FROM node:18-alpine AS RUN_IMAGE

WORKDIR /srv/app
COPY --from=BUILD_IMAGE /srv/app .

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
ENV PORT 4000

EXPOSE 4000

CMD ["node", "bin/www"]