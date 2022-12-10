FROM node:18

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

VOLUME /usr/src/app/db.json

EXPOSE 8080

RUN yarn build

CMD [ "yarn", "start" ]