FROM node:16
EXPOSE 3333
WORKDIR /srv/feedr
ADD . /srv/feedr

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
ENV PORT 3333

RUN yarn --production

CMD ["yarn", "start"]
