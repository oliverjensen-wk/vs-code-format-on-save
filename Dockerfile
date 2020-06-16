FROM node:12.17-alpine3.11

WORKDIR /usr/src/extension

COPY . .

RUN yarn install && yarn compile && yarn lint