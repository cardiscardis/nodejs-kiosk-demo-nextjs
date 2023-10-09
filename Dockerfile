FROM node:18-bookworm

WORKDIR /app

RUN npm install prisma
RUN npm install next -g