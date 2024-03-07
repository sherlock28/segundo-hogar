FROM node:18-alpine AS react_dev

WORKDIR /app
COPY package*.json ./

RUN npm install --legacy-peer-deps
# RUN npm ci -qy
COPY . .

EXPOSE 3000

CMD ["npm", "start"]