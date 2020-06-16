FROM node:12-alpine

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY ./src ./src

CMD [ "npm", "start" ]
