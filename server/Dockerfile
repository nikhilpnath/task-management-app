FROM node:24-alpine

#Apply security patches
RUN apk update && apk upgrade --no-cache

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]