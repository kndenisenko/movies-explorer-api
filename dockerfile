# Dockerfile created by
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# Only for test purposes

# This file don't install mongodb
# Need to start mongodb separately
# Cant connect to mongoDB after all

FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]