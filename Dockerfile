FROM keymetrics/pm2-docker-alpine:latest

WORKDIR /root/GLinqoln/Core/LinqolnReactClient/relay

RUN apk update
RUN apk add curl

RUN npm install -g yarn

COPY package.json .
RUN yarn

COPY . .

RUN npm run relay
RUN npm run postbuild

EXPOSE 8086
EXPOSE 3006

CMD ["pm2-docker","start","production.yml","--env","production"]

# CMD ["pm2-docker","start","development.yml","--env","development"]
