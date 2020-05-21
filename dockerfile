FROM node:12.16.1-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy over app
COPY . .

RUN yarn install
RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]
