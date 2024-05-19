# Stage 1: Build the Angular app
FROM node:20-alpine AS build

WORKDIR /app

RUN npm install -g @angular/cli

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN ng build
EXPOSE 80
CMD ["ng", "serve"]
