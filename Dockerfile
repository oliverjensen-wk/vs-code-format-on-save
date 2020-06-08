FROM node:12.17.0-alpine

WORKDIR /usr/src/extension

COPY . .

RUN yarn install && yarn compile && yarn lint && yarn test