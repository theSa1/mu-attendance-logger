FROM node:18.12-alpine

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

COPY prisma ./prisma/

RUN yarn install --frozen-lockfile

RUN npx prisma generate

COPY . .

VOLUME /usr/src/app/prisma/main.db

EXPOSE 8080

RUN yarn build

CMD [ "yarn", "start" ]
