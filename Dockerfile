FROM node:9-alpine


WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY index.js .
COPY db.js .
COPY vehicle.js .
COPY server.js .

EXPOSE 3000

CMD npm start