FROM node:18

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate

RUN yarn prisma migrate deploy

VOLUME /usr/src/app/prisma/main.db

EXPOSE 8080

RUN yarn build

CMD [ "yarn", "start" ]
