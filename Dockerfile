# syntax=docker/dockerfile:1

# ---- Base Node ----
FROM node:21-alpine AS base
WORKDIR /opt
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm install

# ---- Copy Files/Build ----
FROM dependencies AS build
WORKDIR /opt/netvis
COPY . /opt/netvis
RUN npm run build

# ---- Release ----
FROM nginx
WORKDIR /usr/share/nginx/html/
COPY --from=build /opt/netvis/build .
EXPOSE 80
