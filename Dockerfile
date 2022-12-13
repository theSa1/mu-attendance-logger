FROM node:18

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate

EXPOSE 8080

RUN yarn build

CMD [ "yarn", "start" ]
