FROM node:16-alpine as prod
RUN npm install pm2 -g
WORKDIR /usr
COPY package.json ./
RUN npm install --only=production

COPY ./src ./
COPY .env ./

EXPOSE 4100
CMD ["pm2-runtime","index.js"]
