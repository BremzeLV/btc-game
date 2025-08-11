FROM node:22.17.0-alpine

RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node

COPY api/package*.json /tmp/app/
RUN cd /tmp/app && npm install

COPY ./api/ /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app

WORKDIR /usr/src/app
RUN if [ ! -f .env ]; then cp .env.example .env; fi
RUN npm run build