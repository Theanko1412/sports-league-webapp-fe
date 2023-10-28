FROM node:18-alpine

WORKDIR /app

COPY ./build ./build
RUN npm install -g serve

ENTRYPOINT ["serve", "-s", "build", "-l", "3000"]

EXPOSE 3000