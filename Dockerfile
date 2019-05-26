FROM node:10.15.3
WORKDIR /usr/data/graph-engine
COPY package*.json ./
RUN npm install

COPY . .