FROM keymetrics/pm2:16-alpine

# Bundle APP files
COPY bin bin/
COPY public public/
COPY routes routes/
COPY src src/
COPY models models/
COPY views views/
COPY package.json .
COPY yarn.lock .
COPY ecosystem.config.js .

# Add Python for node-gyp / fastfeed
RUN apk add --update python3 python3-dev py-pip build-base

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN yarn --production

# Expose the listening port of your app
EXPOSE 8080

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
